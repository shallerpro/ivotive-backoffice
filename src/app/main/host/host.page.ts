import {Component, inject, OnInit} from '@angular/core';
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



@Component({
    selector: 'hosts-edit-cds',
    templateUrl: './host.page.html',
    styleUrls: ['./host.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem]
})
export class HostPage implements OnInit {

    public hostForm = new FormGroup({
        AiIKeywords: new FormControl(''),
        AiSystemInstruction: new FormControl(''),
        key: new FormControl(''),
        url: new FormControl(''),
    });

    public currentId: string = "";
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    private userService: UserService = inject(UserService);
    private hostService: HostService = inject(HostService);

    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
        this.userService.user$.subscribe(async ( user) => {
            if (user)
                await this.init();

        });

    }

    async init() {

        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];


        if (this.currentId) {

            let host: HostModel | false = await this.hostService.getHostById( this.currentId );

            if ( host) {

                this.hostForm.patchValue(
                    {

                        AiIKeywords: host.AiIKeywords,
                        AiSystemInstruction: host.AiSystemInstruction,
                        key: host.key,
                        url : host.url


                    }
                )
            }


        } else {

            this.hostForm.patchValue({});
        }


    }

    async ngOnInit() {


    }




    async doValidPost() {

        try {
            let host: HostModel = new HostModel();
            host.AiSystemInstruction =  this.hostForm.value.AiSystemInstruction ? this.hostForm.value.AiSystemInstruction : "";
            host.AiIKeywords = this.hostForm.value.AiIKeywords ? this.hostForm.value.AiIKeywords : "";
            host.url = this.hostForm.value.url ? this.hostForm.value.url : "";
            host.key = this.hostForm.value.key ? this.hostForm.value.key : "";



            if (this.currentId != '') {
                host.id = this.currentId;
                await this.hostService.edit ( host );

            }

            await this.router.navigate(['/main/hosts']);
        } catch (e) {

            console.error("doValidPost", e);
        }
    }


}
