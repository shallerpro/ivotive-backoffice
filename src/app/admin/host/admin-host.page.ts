import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
    IonButton, IonChip,
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
import {Subscription} from "rxjs";
import {AdminService} from "../../../shared/services/admin.service";
import {OrganizationModel} from "../../../shared/models/organization.model";


@Component({
    templateUrl: './admin-host.page.html',
    styleUrls: ['./admin-host.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent, IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule, IonChip]
})
export class AdminHostPage implements OnInit, OnDestroy {

    public form = new FormGroup({
        key: new FormControl(''),
        url: new FormControl(''),
        AiIKeywords: new FormControl(''),
        AiSystemInstruction: new FormControl(''),
    });

    public title = "Ajouter un domaine";
    public currentId: string = "";
    public selectedOrganizationId: string = "";
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    public  organizations : any[] = [];
    public  organizations$! : Subscription;
    private readonly adminService: AdminService = inject(AdminService);
    private readonly hostService: HostService = inject(HostService);


    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})

    }


    async ngOnInit() {

        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];

        if (this.currentId) {

            this.title = "Editer un domain"

            let currentHost : HostModel  | false  = await this.hostService.getHostById( this.currentId );

            if ( currentHost ) {
                this.selectedOrganizationId = currentHost.organizationId;

                this.form.patchValue( currentHost.toJSON([]) );

            }





        } else {

            this.form.patchValue({});
        }

        this.organizations$ = this.adminService.getOrganizations().subscribe({
            next: (data : any) => {

                this.organizations = [];
                for ( let d of data) {

                    let o : OrganizationModel = new OrganizationModel(d);

                    if ( this.selectedOrganizationId != "" && this.selectedOrganizationId == o.id )
                        o.raw.selected = true ;


                    this.organizations.push( o )
                }
            }
        });

    }
    ngOnDestroy(): void {
        this.organizations$.unsubscribe();

    }


    async doSelect( selected : any ) {
        this.selectedOrganizationId = selected[0].id;
    }

    async doValid() {

        try {
            let host: HostModel = new HostModel(this.form.value);
            host.organizationId = this.selectedOrganizationId;

            if ( this.currentId != "") {
                host.id = this.currentId;


                await this.hostService.edit(host);
            } else {
                await this.hostService.add ( host );

            }


            await this.router.navigate(['/admin/hosts']);
        } catch (e) {

            console.error("doValid", e);
        }
    }

    async doRemove() {

        if (this.currentId != '')
            await this.hostService.delete(this.currentId);

        await this.router.navigate(['/admin/hosts'])
    }



}
