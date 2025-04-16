import {Routes} from "@angular/router";
import {AuthPage} from "./auth.page";
import {SignInPage} from "./signin/sign-in.page";


export const authRoutes: Routes = [{
    path: '',
    component: AuthPage,
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'signIn'
        },
        {
            path: 'signIn',
            component: SignInPage
        }
    ]
}];
