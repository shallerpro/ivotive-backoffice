import { CanActivateFn } from '@angular/router';
import {UserService} from "../services/user.service";
import {inject} from "@angular/core";
import {UserRole} from "../models/user.model";

export const adminGuard: CanActivateFn = (route, state) => {

  let userService : UserService = inject ( UserService);

  let user : any = userService.currentUser.value;

  if ( userService.isConnected() && user && user.role == UserRole.admin ) return true ;
  return false ;


};
