import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {IonChip, IonItem} from "@ionic/angular/standalone";
import {UserService} from "../../services/user.service";
import {UserRole} from "../../models/user.model";

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, IonChip, IonItem, RouterLink]
})
export class MenuItemComponent  implements OnInit {

  public url: string = "";
  public isAdmin : boolean = false;
  public customMenuName = "";

  private readonly router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd)
        this.url = val.url;
    });


    this.userService.obsCurrentHost().subscribe(async (host) => {
          if (host) {
              this.customMenuName = host.customMenuName;

          }
    });

    this.userService.user$.subscribe(async (user) => {
      if ( this.userService.currentUser && this.userService.currentUser.role == UserRole.admin ) {
        this.isAdmin = true;
      } else this.isAdmin = false;
    })
  }


  ngOnInit() {}

}
