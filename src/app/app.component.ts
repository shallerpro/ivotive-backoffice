import {Component, HostListener} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import {ScreensizeService} from "../shared/services/screensize.service";
import {environment} from "../environments/environment";
import {Editor, Toolbar} from "ngx-editor";



@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {

    public static version = environment.appVersion;
    public static toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        //['code', 'blockquote'],
        //['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        //['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];


    constructor(public platform: Platform , public screensizeService : ScreensizeService) {

        this.initializeApp();

        console.log("AppComponent" , "constructor");
    }

    initializeApp() {
        this.platform.ready().then(() => {


            console.log("AppComponent" , "initializeApp");

            this.screensizeService.onResize( this.platform.width() )
        })
    }

    @HostListener('window:resize', ['$event'])
    private onResize( event : any) {
        console.log("AppComponent" , "onResize");

        this.screensizeService.onResize(event.target.innerWidth );
    }

}
