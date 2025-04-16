import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail, IonToggle
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline} from "ionicons/icons";
import {Observable} from "rxjs";
import {NgStyle} from "@angular/common";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {AdminService} from "../../../shared/services/admin.service";
import {UserModel} from "../../../shared/models/user.model";
import {UserService} from "../../../shared/services/user.service";



@Component({
    selector: 'users-page',
    templateUrl: 'admin-users.page.html',
    styleUrls: ['admin-users.page.scss'],
    standalone : true ,
    imports: [ HeaderComponent , ItemSelectorComponent,IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, NgStyle, IonLabel, IonToggle, IonCol]
})
export class AdminUsersPage implements OnInit {

    private readonly adminService: AdminService = inject(AdminService);
    private readonly userService: UserService = inject(UserService);
    private readonly router: Router = inject(Router);

    public users : UserModel[] = [];

    constructor() {
        addIcons({add, reorderThreeOutline});
    }

    async doEnabled (userId : any , $event : any ){
        console.log( userId , $event);
        let user : UserModel | false = await this.userService.getUserById( userId);

        if ( user ) {
            user.enabled = !user.enabled;
            await this.userService.edit ( user );
        }

    }

    async ngOnInit() {
        this.users = await this.adminService.getUsers();
    }


    async doEdit( uid : string) {
        await this.router.navigate(['/admin/user', {id: uid}]);
    }


}
