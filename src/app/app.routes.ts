import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/auth/signIn']);

export const routes: Routes = [
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./main/main.routes').then(m => m.mainRoutes),
        data: {authGuardPipe: redirectUnauthorizedToLogin}
    },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./admin/admin.routes').then(m => m.adminRoutes),
        data: {authGuardPipe: redirectUnauthorizedToLogin}
    },
    {
        path: '',
        loadChildren: () =>
            import('./auth/auth.routes').then(m => m.authRoutes)
    },
   /* {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    }*/

];
