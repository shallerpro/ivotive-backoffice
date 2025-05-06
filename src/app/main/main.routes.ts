import {Routes} from '@angular/router';
import {ListPage} from "./list/list.page";
import {MainPage} from "./main.page";
import {FormPage} from "./form/form.page";
import {SimpleComponent} from "../simple/simple.component";



export const mainRoutes: Routes = [{
    path: '',
    component: MainPage,
    children: [
        {
            path: 'list/:listName',
            component: ListPage,
        },
        {
            path: 'form/:listName/:id',
            component: FormPage
        },

    ]


}];
