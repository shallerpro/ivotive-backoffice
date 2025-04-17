import {Routes} from '@angular/router';
import {CollectionPage} from "./collection/collection.page";
import {MainPage} from "./main.page";
import {DocumentPage} from "./document/document.page";



export const mainRoutes: Routes = [{
    path: '',
    component: MainPage,
    children: [
        {
            path: 'collection/:collectionName',
            component: CollectionPage,
        },
        {
            path: 'document/:collectionName/:id',
            component: DocumentPage,
        },
        {
            path: '',
            redirectTo: 'collection',
            pathMatch: 'full'
        },


    ]


}];
