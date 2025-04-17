import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonThumbnail} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline} from "ionicons/icons";
import {PostService} from "../../../shared/services/post.service";
import {UserService} from "../../../shared/services/user.service";

import {Observable} from "rxjs";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HeaderComponent} from "../../../shared/components/header/header.component";

import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {NgStyle} from "@angular/common";
import {
    EngineDocumentFieldType, IEngineCollection, IEngineCollectionField,
    IEngineDocumentField,
    IEngineMenu
} from "../../../shared/interfaces/engine-settings.interface";
import {EngineService} from "../../../shared/services/engine.service";


@Component({
    selector: 'app-collection',
    standalone: true,
    templateUrl: 'collection.page.html',
    styleUrls: ['collection.page.scss'],
    imports: [IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, HeaderComponent, ItemSelectorComponent, NgStyle]
})
export class CollectionPage implements OnInit {

    private readonly router: Router = inject(Router);
    private route : ActivatedRoute = inject(ActivatedRoute);
    private engine : EngineService = inject(EngineService);

    public collectionName : string = "";
    public label : string = "";
    public headers : IEngineCollectionField[] = [];
    public items :any;


    constructor() {
        addIcons({add, reorderThreeOutline});
    }

    /*
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
*/
    async ngOnInit() {

        if (this.route.snapshot.params['collectionName']) {
            this.collectionName = this.route.snapshot.params['collectionName'];

            let menu : IEngineMenu = this.engine.getMenuByCollectionName( this.collectionName);
            if ( menu )
                this.label = menu.label;

            let collection : IEngineCollection = await this.engine.getCollectionByCollectionName( this.collectionName );

            if ( collection ) {
                this.headers = collection.gridFields;
                this.items = await this.engine.getCollection(collection);
                console.log(this.collectionName);
            }
        }

    }


    async doAdd() {
        await this.router.navigate(['/main/post'])

    }

    async doEdit(postId: string) {
        await this.router.navigate(['/main/post', {id: postId}]);
    }


    protected readonly EngineDocumentFieldType = EngineDocumentFieldType;
}
