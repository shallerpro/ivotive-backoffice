import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {IonChip, IonItem} from "@ionic/angular/standalone";
import {UserService} from "../../services/user.service";
import {UserRole} from "../../models/user.model";
import {IEngineMenu} from "../../interfaces/engine-settings.interface";
import {EngineService} from "../../services/engine.service";

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, IonChip, IonItem, RouterLink]
})
export class MenuItemComponent  implements OnInit {

  public url: string = "";
  public customMenuName = "";
  public menus : IEngineMenu[] = []

  private readonly router: Router = inject(Router);
  private readonly engine: EngineService = inject(EngineService);

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd)
        this.url = val.url;
    });

    this.menus = this.engine.getMenus();

  }


  ngOnInit() {}

}
