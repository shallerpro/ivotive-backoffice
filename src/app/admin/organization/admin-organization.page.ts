import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
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
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {Editor, NgxEditorModule} from "ngx-editor";
import {CategorieModel} from "../../../shared/models/categorie.model";
import {doc, Firestore} from "@angular/fire/firestore";
import {SettingsService} from "../../../shared/services/settings.service";
import {StorageService} from "../../../shared/services/storage.service";
import {UserService} from "../../../shared/services/user.service";
import {HostService} from "../../../shared/services/host.service";
import {PostService} from "../../../shared/services/post.service";
import {PostModel} from "../../../shared/models/post.model";
import {HostModel} from "../../../shared/models/host.model";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {OrganizationService} from "../../../shared/services/organization.service";
import {OrganizationModel} from "../../../shared/models/organization.model";
import {Subscription} from "rxjs";
import {AdminService} from "../../../shared/services/admin.service";


@Component({
    templateUrl: './admin-organization.page.html',
    styleUrls: ['./admin-organization.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent,IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule]
})
export class AdminOrganizationPage implements OnInit, OnDestroy {

    public form = new FormGroup({
        name: new FormControl(''),
    });

    public title = "Ajouter une entreprise";
    public currentId: string = "";
    public currentImageUrl: string = "";
    private firestore: Firestore = inject(Firestore);
    private settings: SettingsService = inject(SettingsService);
    private organizationService: OrganizationService = inject(OrganizationService);


    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);




    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
    }



    async ngOnInit() {
        if (this.route.snapshot.params['id'])
        this.currentId = this.route.snapshot.params['id'];


        if (this.currentId) {

            this.title = "Editer une entreprise"
            let organization: OrganizationModel | false = await this.organizationService.getById(this.currentId);

            if (organization) {
                this.form.patchValue(
                    organization.toJSON([])
                )

            }
        } else {

            this.form.patchValue({});
        }

    }

    ngOnDestroy(): void {
    }

    async doValid() {

        try {
            let organization: OrganizationModel = new OrganizationModel(
                this.form.value as OrganizationModel
            );


            if (this.currentId != '') {
                organization.id = this.currentId;
                await this.organizationService.edit(organization);

            } else {
                await this.organizationService.add(organization);
            }

            await this.router.navigate(['/admin/organizations']);
        } catch (e) {

            console.error("doValid admin-organization", e);
        }
    }


}
