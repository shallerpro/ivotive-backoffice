import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent, IonItem, IonList} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HostModel} from "../../../shared/models/host.model";
import {PostModel} from "../../../shared/models/post.model";
import {UserService} from "../../../shared/services/user.service";
import {HostService} from "../../../shared/services/host.service";
import {CustomDataModel} from "../../../shared/models/custom-data.model";
import {UserModel} from "../../../shared/models/user.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-hosts',
    templateUrl: './hosts.page.html',
    styleUrls: ['./hosts.page.scss'],
    imports: [IonContent, CommonModule, FormsModule, HeaderComponent, IonItem, IonList, StripHtmlPipe]
})
export class HostsPage implements OnInit {

    public items: HostModel[] = [];
    private userService: UserService = inject(UserService);
    private hostService: HostService = inject(HostService);
    private readonly router: Router = inject(Router);

    constructor() {

        this.userService.user$.subscribe(async ( user) => {
            if (user)
                await this.init(user);

        });
    }

    async ngOnInit() {

    }

    async init( currentUser : UserModel ) {
        let user: UserModel | null = await this.userService.getCurrentUser();

        if (user) {
            this.items = await this.hostService.getHostsByUser(user);

        }
    }

    async doEdit( id : string) {
        await this.router.navigate(['/main/host' , {id : id}]);
    }



}
