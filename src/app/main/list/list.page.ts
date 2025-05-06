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
    EngineDocumentFieldType, IEngineList, IEngineListField,
    IEngineDocumentField,
    IEngineMenu
} from "../../../shared/interfaces/engine-settings.interface";
import {EngineService} from "../../../shared/services/engine.service";
import {FormsModule} from "@angular/forms";
import {collection, collectionData, Firestore, query, where} from "@angular/fire/firestore";


@Component({
    selector: 'app-list',
    standalone: true,
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss'],
    imports: [IonContent, IonList, IonItem, IonInput, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, HeaderComponent, ItemSelectorComponent, NgStyle, FormsModule, IonCol, IonButton, IonRow]
})
export class ListPage implements OnInit {

    private readonly router: Router = inject(Router);
    private route : ActivatedRoute = inject(ActivatedRoute);
    private firestore: Firestore = inject(Firestore);
    private collection$? : Observable<any>;
    public currentSearch : string = "";
    public listName : string = "";
    public label : string = "";
    public headers : IEngineListField[] = [];
    public fullItems :any;
    public currentItems : any ;
    public fullTtemCount : number = 0;
    public currentItemCount : number = 0;

    public engine : EngineService = inject(EngineService);


    constructor() {
        addIcons({add, reorderThreeOutline , searchOutline});
    }


    verifyImage( item : any , type : EngineDocumentFieldType ) {

        let ret = null ;

        if ( type === EngineDocumentFieldType.image && item ) ret = item ;
        if ( type === EngineDocumentFieldType.images && item && item.length > 0 ) ret = item[0];

        if ( !ret ) ret = '/assets/images/default-image.svg';
        return ret ;
    }

   async prepareObservable ( c : IEngineList ) {

        let request : any = [] ;

        if ( c.filter ) {
            request.push ( where ( c.filter.field , '==' , c.filter.value ) );
        }

        this.collection$ = collectionData(  query(
                collection(this.firestore, c.collectionName) ,request ), {idField: 'id'}) as Observable<any[]>;


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

        if (this.route.snapshot.params['listName']) {
            this.listName = this.route.snapshot.params['listName'];

            let menu : IEngineMenu = this.engine.getMenuByListName( this.listName);
            if ( menu )
                this.label = menu.label;


            let list : IEngineList = await this.engine.getListByName( this.listName );


            if ( list ) {
                this.headers = list.listFields;


                try {
                    await this.prepareObservable ( list )
                    console.log( this.listName);
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
        await this.router.navigate(['/main/form/' + this.listName + '/' + id ]);
    }


    protected readonly EngineDocumentFieldType = EngineDocumentFieldType;
}
