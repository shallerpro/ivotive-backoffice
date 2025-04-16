import {Component, inject, OnInit} from '@angular/core';
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



@Component({
    selector: 'hosts-page',
    templateUrl: 'admin-hosts.page.html',
    styleUrls: ['admin-hosts.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent,IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail,  NgStyle, IonLabel]
})
export class AdminHostsPage implements OnInit {

    private readonly adminService: AdminService = inject(AdminService);
    private readonly router: Router = inject(Router);
    public hosts$! : Subscription;
    public items : any;

    constructor() {
        addIcons({add, reorderThreeOutline});


    }



    async ngOnInit() {
        this.hosts$ = this.adminService.getHosts().subscribe({
            next: (data : any) => {
                this.items = data;
            },
            error: (error : any) => {
                console.error(error);
            },
        });
    }

    async ngOnDestroy() {
        this.hosts$.unsubscribe();
    }


    async doEdit( id : string) {
        await this.router.navigate(['/admin/host', {id: id}]);
    }


}
