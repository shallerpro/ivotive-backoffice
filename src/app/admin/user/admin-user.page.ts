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
import {UserModel} from "../../../shared/models/user.model";


@Component({
    templateUrl: './admin-user.page.html',
    styleUrls: ['./admin-user.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent,IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea,IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule]
})
export class AdminUserPage implements OnInit, OnDestroy {

    public form = new FormGroup({
        email: new FormControl(''),
    });

    public title = "Ajouter un utilisateur";
    public currentId: string = "";
    public selectedOrganizationId: string = "";
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    public  organizations : any[] = [];
    public  organizations$! : Subscription;
    private readonly adminService: AdminService = inject(AdminService);
    private readonly userService: UserService = inject(UserService);



    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
    }



    async ngOnInit() {
        if (this.route.snapshot.params['id'])
        this.currentId = this.route.snapshot.params['id'];




        if (this.currentId != "") {
            this.title = "Editer une entreprise";

            let user : UserModel | false  = await this.userService.getUserById( this.currentId)

            if ( user ) {
                this.form.patchValue(user.toJSON());
                this.selectedOrganizationId = user.organizationId;

            }


        } else {

            this.form.patchValue({});
        }


        this.organizations$ = this.adminService.getOrganizations().subscribe({
                next: (data: any) => {

                    this.organizations = [];
                    for (let d of data) {

                        let o: OrganizationModel = new OrganizationModel(d);

                        if (this.selectedOrganizationId != "" && this.selectedOrganizationId == o.id)
                            o.raw.selected = true;

                        this.organizations.push(o)
                    }
                }
            }
        );

    }

    ngOnDestroy(): void {
    }


    async doSelect( selected : any ) {
        this.selectedOrganizationId = selected[0].id;
    }

    async doValid() {

        try {
            let user: UserModel = new UserModel(
                this.form.value as UserModel
            );


            if (this.currentId != '') {
                user.id = this.currentId;
                user.organizationId = this.selectedOrganizationId;
                await this.userService.edit(user);

            }

            await this.router.navigate(['/main/organizations']);
        } catch (e) {

            console.error("doValid admin-organization", e);
        }
    }


}
