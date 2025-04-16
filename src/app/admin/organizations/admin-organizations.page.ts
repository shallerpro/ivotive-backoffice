import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline} from "ionicons/icons";
import {Observable, Subscription} from "rxjs";
import {NgStyle} from "@angular/common";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {AdminService} from "../../../shared/services/admin.service";
import {HostModel} from "../../../shared/models/host.model";
import {OrganizationModel} from "../../../shared/models/organization.model";



@Component({
    templateUrl: 'admin-organizations.page.html',
    styleUrls: ['admin-organizations.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent,IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail,NgStyle, IonLabel]
})
export class AdminOrganizationsPage implements OnInit , OnDestroy {

    private readonly adminService: AdminService = inject(AdminService);
    private readonly router: Router = inject(Router);

    public organizations$! : Subscription;
    public items : any;


    constructor() {
        addIcons({add, reorderThreeOutline});


    }



    async ngOnInit() {
        this.organizations$ = this.adminService.getOrganizations().subscribe({
            next: (data : any) => {
                this.items = data;
            },
            error: (error : any) => {
                console.error(error);
            },
        });
    }

    async ngOnDestroy() {
        this.organizations$.unsubscribe();
    }



    async doEdit( id : string) {
        await this.router.navigate(['/admin/organization', {id: id}]);
    }


}
