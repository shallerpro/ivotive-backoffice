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
import {EngineService} from "../../shared/services/engine.service";
import {engineEnvironment} from "../../environments/engine-environment";

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
    public name : string = "";
    protected readonly close = close;

    public readonly userService: UserService = inject(UserService);
    public readonly engineService: EngineService = inject(EngineService);
    private readonly router: Router = inject(Router);
    public email = "";


    constructor() {
        addIcons({
            menuOutline
        });


        this.name = this.engineService.getName();


        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd)
                this.url = val.url;
        });
    }

    ngOnInit() {


    }

    async logout() {
        await this.userService.logout();
    }


    protected readonly AppComponent = AppComponent;
}
