import {Component, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuToggle, IonRouterOutlet, IonRow, IonSplitPane
} from "@ionic/angular/standalone";
import {MenuItemComponent} from "../../shared/components/menu-item/menu-item.component";
import {AppComponent} from "../app.component";
import {UserService} from "../../shared/services/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {addIcons} from "ionicons";
import {menuOutline} from "ionicons/icons";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss'],
    imports: [
        IonButton,
        IonCol,
        IonContent,
        IonFooter,
        IonItem,
        IonLabel,
        IonMenu,
        IonMenuToggle,
        IonRouterOutlet,
        IonRow,
        IonSplitPane,
        MenuItemComponent
    ]
})
export class AdminPage implements OnInit {

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
