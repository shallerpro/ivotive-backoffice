import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {
    IonButton,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonInput,
    IonItem,
    IonList, IonRow,
    IonThumbnail
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline, searchOutline} from "ionicons/icons";
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
import {FormsModule} from "@angular/forms";
import {collection, collectionData, Firestore, query} from "@angular/fire/firestore";


@Component({
    selector: 'app-collection',
    standalone: true,
    templateUrl: 'collection.page.html',
    styleUrls: ['collection.page.scss'],
    imports: [IonContent, IonList, IonItem, IonInput, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, HeaderComponent, ItemSelectorComponent, NgStyle, FormsModule, IonCol, IonButton, IonRow]
})
export class CollectionPage implements OnInit {

    private readonly router: Router = inject(Router);
    private route : ActivatedRoute = inject(ActivatedRoute);
    private firestore: Firestore = inject(Firestore);
    private collection$? : Observable<any>;
    public currentSearch : string = "";
    public collectionName : string = "";
    public label : string = "";
    public headers : IEngineCollectionField[] = [];
    public fullItems :any;
    public currentItems : any ;
    public fullTtemCount : number = 0;
    public currentItemCount : number = 0;

    public engine : EngineService = inject(EngineService);


    constructor() {
        addIcons({add, reorderThreeOutline , searchOutline});
    }

    /*
    onSelectCategories(categories: CategorieModel[]) {
        console.log(categories);
    }


     */
   async prepareObservable ( c : IEngineCollection ) {

       this.collection$ = collectionData(  query(
            collection(this.firestore, c.name) ), {idField: 'id'}) as Observable<any[]>;



       this.collection$.subscribe( async () => {
               this.fullItems = await this.engine.composeGridCollection(c);
               this.fullTtemCount = this.fullItems.length;
               this.doSearch(this.currentSearch);
           }
       );

   }



    doResetSearch () {
        this.currentSearch = '';
        this.doSearch();
    }

    doOnKeyUp ( $event : any ) {
        this.doSearch ( this.currentSearch );
    }

    doSearch ( search : string = "" ) {

        this.currentItems = this.fullItems.filter( ( item : any ) => {

            if ( search == '') return true ;

            try {


                for (let header of this.headers) {

                    let value: any =   item[ header.name ] ;

                    if ( typeof value == 'string' && value.toUpperCase().indexOf(search.toUpperCase()) !== -1)
                        return true;
                }
            } catch (e) {
                console.error(e);
            }

            return false ;
        })

        this.currentItemCount = this.currentItems.length;
        console.log( this.currentItems );

    }




    async ngOnInit() {

        if (this.route.snapshot.params['collectionName']) {
            this.collectionName = this.route.snapshot.params['collectionName'];

            let menu : IEngineMenu = this.engine.getMenuByCollectionName( this.collectionName);
            if ( menu )
                this.label = menu.label;


            let collection : IEngineCollection = await this.engine.getCollectionByName( this.collectionName );


            if ( collection ) {
                this.headers = collection.gridFields;

                try {
                    await this.prepareObservable ( collection )
                    console.log(this.collectionName);
                } catch ( e ) {
                    this.fullItems = [];
                    console.error(e);
                }
            }
        }

    }


    async doAdd() {
        await this.router.navigate(['/main/post'])

    }

    async doEdit( id : string) {
        await this.router.navigate(['/main/document/' + this.collectionName + '/' + id ]);
    }


    protected readonly EngineDocumentFieldType = EngineDocumentFieldType;
}
