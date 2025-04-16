import {Component, OnInit} from '@angular/core';
import {IonRouterOutlet} from "@ionic/angular/standalone";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    imports: [IonRouterOutlet]
})
export class AuthPage implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
