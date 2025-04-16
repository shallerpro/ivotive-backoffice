import {Routes} from '@angular/router';
import {CollectionPage} from "./collection/collection.page";
import {MainPage} from "./main.page";
import {DocumentPage} from "./document/document.page";
import {HostsPage} from "./hosts/hosts.page";
import {CdsPage} from "./cds/cds.page";
import {CdPage} from "./cd/cd.page";
import {HostPage} from "./host/host.page";
import {ReplaceListPage} from "./replace/list/replace-list.page";
import {ReplaceEditPage} from "./replace/edit/replace-edit.page";



export const mainRoutes: Routes = [{
    path: '',
    component: MainPage,
    children: [
        {
            path: 'post',
            component: DocumentPage,
        },
        {
            path: 'document/:id',
            component: DocumentPage,
        },
        {
            path: 'cd',
            component: CdPage,
        },
        {
            path: 'cd/:id',
            component: CdPage,
        },
        {
            path: 'cds',
            component: CdsPage,
        },
        {
            path: 'replace-list',
            component: ReplaceListPage,
        },
        {
            path: 'replace-edit',
            component: ReplaceEditPage,
        },
        {
            path: 'hosts',
            component: HostsPage
        },
        {
            path: 'host',
            component: HostPage
        },
        {
            path: 'host/:id',
            component: HostPage
        },
        {
            path: '',
            redirectTo: 'collection',
            pathMatch: 'full'
        },


    ]


}];
