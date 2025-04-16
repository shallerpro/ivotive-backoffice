import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../services/user.service";
import {inject} from "@angular/core";

export const mainGuard: CanActivateFn = (route, state) => {
  let userService : UserService = inject ( UserService);
  const router = inject(Router);

  if ( userService.currentUser ) {

    if ( !userService.currentUser.enabled ) {
      return false ;
    }

    return true ;
  } else {
    return false;
  }

};
