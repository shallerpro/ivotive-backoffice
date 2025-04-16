import {Routes} from '@angular/router';
import {AdminUsersPage} from "../admin/users/admin-users.page";
import {AdminHostsPage} from "../admin/hosts/admin-hosts.page";
import {AdminHostPage} from "../admin/host/admin-host.page";
import {AdminOrganizationsPage} from "../admin/organizations/admin-organizations.page";
import {AdminOrganizationPage} from "../admin/organization/admin-organization.page";
import {AdminUserPage} from "../admin/user/admin-user.page";
import {AdminPage} from "./admin.page";


export const adminRoutes: Routes = [{
    path: '',
    component: AdminPage,
    children: [
        {
            path: 'host',
            component: AdminHostPage,

        },
        {
            path: 'host/:id',
            component: AdminHostPage,

        },
        {
            path: 'organization',
            component: AdminOrganizationPage,

        },
        {
            path: 'organization/:id',
            component: AdminOrganizationPage,

        },
        {
            path: 'organizations',
            component: AdminOrganizationsPage,

        },
        {
            path: 'user',
            component: AdminUserPage,

        },
        {
            path: 'user/:id',
            component: AdminUserPage,

        },
        {
            path: 'users',
            component: AdminUsersPage,

        },
        {
            path: 'hosts',
            component: AdminHostsPage,

        },
        {
            path: '',
            redirectTo: 'organizations',
            pathMatch: 'full'
        }
    ]

}];
