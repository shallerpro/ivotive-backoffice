import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon, IonLabel,
    IonMenuButton,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {add, chevronBackOutline} from "ionicons/icons";
import {ScreensizeService} from "../../services/screensize.service";
import {MenuController} from "@ionic/angular";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone : true,
    imports: [
        IonHeader,
        IonToolbar,
        IonIcon,
        IonTitle,
        IonButton,
        NgIf,
        IonButtons,
        IonMenuButton,
        IonLabel,
    ]
})
export class HeaderComponent implements OnInit {
    @Input() title: string = "";
    @Input() isPopin : boolean = false;
    @Input() showAdd : boolean = false;
    @Input() backRouter : string = "/main/collection";
    @Input() onAddRouter : string = "/main/document";

    private isSidebarOpen: boolean = false;
    public readonly screenSize : ScreensizeService = inject(ScreensizeService);
    private readonly router: Router = inject(Router);
    private readonly menuController : MenuController = inject(MenuController);

    constructor() {

        addIcons({add, chevronBackOutline});

    }

    ngOnInit() {
    }


    async doAdd() {
        await this.router.navigate([ this.onAddRouter])

    }



    async doBack() {

        if ( this.backRouter != '' )


        await this.router.navigate([ this.backRouter ]);
    }
}
