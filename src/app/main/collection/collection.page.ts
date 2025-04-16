import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonThumbnail} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline} from "ionicons/icons";
import {PostService} from "../../../shared/services/post.service";
import {UserService} from "../../../shared/services/user.service";
import {PostModel} from "../../../shared/models/post.model";
import {Observable} from "rxjs";
import {HostModel} from "../../../shared/models/host.model";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {HostService} from "../../../shared/services/host.service";
import {CategorieModel} from "../../../shared/models/categorie.model";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {NgStyle} from "@angular/common";


@Component({
    selector: 'app-collection',
    templateUrl: 'collection.page.html',
    styleUrls: ['collection.page.scss'],
    imports: [IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, HeaderComponent, ItemSelectorComponent, NgStyle]
})
export class CollectionPage implements OnInit {

    public currentHostName = '';
    public items: PostModel[] = [];
    public categories: CategorieModel[] = [];
    private readonly postService: PostService = inject(PostService);
    private readonly userService: UserService = inject(UserService);
    private readonly hostService: HostService = inject(HostService);
    private readonly router: Router = inject(Router);
    private refresh$: Observable<any> | null = null;

    constructor() {
        addIcons({add, reorderThreeOutline});

        this.userService.obsCurrentHost().subscribe(async (host) => {
            if (host) {
                await this.init(host);
                this.categories = await this.hostService.getCategoriesByHost(host);
            }
        });


    }

    onSelectCategories(categories: CategorieModel[]) {
        console.log(categories);
    }

    async init(host: HostModel) {

        let items: any = await this.postService.getPostsByHost(host);
        this.currentHostName = host.url;

        this.refresh$ = this.postService.getPostObservable(host);

        if (this.refresh$.subscribe(async () => {
            console.log("refresh");

            this.items = await this.postService.getPostsByHost(host);
        }))

            if (items)
                this.items = items

    }

    async ngOnInit() {


    }


    async doAdd() {
        await this.router.navigate(['/main/post'])

    }

    async doEdit(postId: string) {
        await this.router.navigate(['/main/post', {id: postId}]);
    }


}
