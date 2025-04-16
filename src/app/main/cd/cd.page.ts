import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonRow,
    IonTextarea,
    IonToggle
} from "@ionic/angular/standalone";

import {addIcons} from "ionicons";
import {arrowBackOutline, chevronDownOutline, chevronUpOutline} from "ionicons/icons";
import {ActivatedRoute, Router} from "@angular/router";
import {doc, Firestore} from "@angular/fire/firestore";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {CategorieModel} from "../../../shared/models/categorie.model";
import {SettingsService} from "../../../shared/services/settings.service";
import {StorageService} from "../../../shared/services/storage.service";
import {UserService} from "../../../shared/services/user.service";
import {HostService} from "../../../shared/services/host.service";
import {PostService} from "../../../shared/services/post.service";
import {PostModel} from "../../../shared/models/post.model";
import {HostModel} from "../../../shared/models/host.model";
import {CustomDataModel} from "../../../shared/models/custom-data.model";
import {CdService} from "../../../shared/services/cd.service";
import {Editor, NgxEditorModule} from "ngx-editor";
import {AppComponent} from "../../app.component";



@Component({
    selector: 'cds-edit-cds',
    templateUrl: './cd.page.html',
    styleUrls: ['./cd.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem, NgxEditorModule]
})
export class CdPage implements OnInit , OnDestroy {

    public cdForm = new FormGroup({
        name: new FormControl(''),
        section: new FormControl(''),
        type: new FormControl(''),
        value : new FormControl(''),

    });

    public editor!: Editor;

    public currentId: string = "";
    private firestore: Firestore = inject(Firestore);
    private settings: SettingsService = inject(SettingsService);
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    private storageService: StorageService = inject(StorageService);
    private userService: UserService = inject(UserService);
    private hostService: HostService = inject(HostService);
    private customDataService: CdService = inject(CdService);

    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
        this.userService.obsCurrentHost().subscribe(async (host) => {
            if (host)
                await this.init(host);

        });
    }

    async init(host: HostModel) {


        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];


        if (this.currentId) {

            let cd: CustomDataModel | null = await this.customDataService.getCustomDataById(this.currentId);

            if (cd) {

                this.cdForm.patchValue(
                    {

                        name: cd.name,
                        section: cd.section,
                        type: cd.type,
                        value : cd.value

                    }
                )


            }


        } else {

            this.cdForm.patchValue({});
        }


    }
    async ngOnInit() {
        this.editor = new Editor();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    async doValidPost() {

        try {
            let cd: CustomDataModel = new CustomDataModel();
            cd.value = this.cdForm.value.value ? this.cdForm.value.value : "";


            if (this.currentId != '') {
                cd.id = this.currentId;
                await this.customDataService.editCD(cd);

            }

            await this.router.navigate(['/main/cds']);
        } catch (e) {

            console.error("doAddPost", e);
        }
    }


    protected readonly AppComponent = AppComponent;
}
