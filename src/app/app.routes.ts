import {Routes} from '@angular/router';
import {AuthPage} from "./auth/auth.page";


export const routes: Routes = [

    {
        path: 'main',
        loadChildren: () =>
            import('./main/main.routes').then(m => m.mainRoutes)

    },

    {
        path: 'auth',
        component : AuthPage
    },

    {
        path : '',
        redirectTo : '/auth',
        pathMatch: 'full',
    }


];
