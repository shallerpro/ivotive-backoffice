import {Component, inject, OnInit} from '@angular/core';
import {
    IonButton, IonCol,
    IonContent, IonFooter, IonHeader,
    IonIcon, IonImg,
    IonItem,
    IonLabel,
    IonMenu, IonMenuToggle,
    IonRouterOutlet, IonRow,
    IonSplitPane, IonThumbnail, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {ActiveRootPipe} from "../../shared/pipes/active-root.pipe";
import {addIcons} from "ionicons";
import {menuOutline} from "ionicons/icons";
import {ScreensizeService} from "../../shared/services/screensize.service";
import {MenuController} from "@ionic/angular";
import {AppComponent} from "../app.component";
import {MenuItemComponent} from "../../shared/components/menu-item/menu-item.component";
import {ItemSelectorComponent} from "../../shared/components/item-selector/item-selector.component";
import {HeaderComponent} from "../../shared/components/header/header.component";

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
    standalone: true,
    imports: [
        IonRouterOutlet,
        IonContent,
        RouterLink,
        IonLabel,
        ActiveRootPipe,
        IonIcon,
        IonItem,
        IonSplitPane,
        IonMenu,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonFooter,
        IonRow,
        IonButton,
        IonMenuToggle,
        IonImg,
        IonThumbnail,
        IonCol,
        ItemSelectorComponent,
        HeaderComponent,
        MenuItemComponent
    ]
})
export class MainPage implements OnInit {
    public url: string = "";
    public hostUrl: string = "";
    protected readonly close = close;

    public readonly userService: UserService = inject(UserService);
    private readonly router: Router = inject(Router);
    public email = "";


    constructor() {
        addIcons({
            menuOutline
        });


        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd)
                this.url = val.url;
        });
    }

    ngOnInit() {

        this.userService.user$.subscribe( (user) => {

            if ( user ) {
                this.email = this.userService.currentUser.email;

            }
        })


        this.userService.obsCurrentHost().subscribe(async (host) => {
            if (host)
                this.hostUrl = host.url
        });


    }

    async logout() {
        await this.router.navigate(["/"]);
        await this.userService.logout();


    }


    protected readonly AppComponent = AppComponent;
}
