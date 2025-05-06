import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    IonButton, IonCol,
    IonContent,
    IonIcon,
    IonInput,
    IonItem, IonLabel,
    IonRow,
    IonTextarea,
    IonToggle
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {arrowBackOutline, chevronDownOutline, chevronUpOutline, lockClosedOutline, searchOutline} from "ionicons/icons";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {StorageService} from "../../../shared/services/storage.service";
import {doc, Firestore} from "@angular/fire/firestore";
import {PostService} from "../../../shared/services/post.service";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {AppComponent} from "../../app.component";
import {UserModel} from "../../../shared/models/user.model";
import {EngineCollections, EngineService} from "../../../shared/services/engine.service";
import {
    EngineDocumentFieldType,
    IEngineDocumentField
} from "../../../shared/interfaces/engine-settings.interface";
import {IdModel} from "../../../shared/models/id.model";
import {DefaultModel} from "../../../shared/models/default.model";
import {ItemSelector} from "../../../shared/models/item-selector.model";


@Component({
    selector: 'app-list-edit',
    templateUrl: './form.page.html',
    standalone: true,
    styleUrls: ['./form.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule, IonCol, FormsModule, IonLabel]
})
export class FormPage implements OnInit, OnDestroy {

    @ViewChild('searchInput') searchInput!: IonInput;



    public form : any ;
    public searchForm : any ;
    public title = "";
    public currentImageUrl = "";
    public editor!: Editor;
    public currentId = "";
    public currentCollectionName = "";
    public currentDocument : any = {};
    public virtualFieldsModified : any = {};
    public backRouter = "";
    public currentCollection  : any ;
    private route = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private engineService : EngineService = inject(EngineService);
    private storageService: StorageService = inject(StorageService);
    public isPublished : boolean = false;
    public inRemoveMode : boolean = false;
    public searchInField : string = "" ; // nom du champs
    public engineFormCollections? : EngineCollections ;
    public searchItems : any[] = [];

    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline , lockClosedOutline , searchOutline } )


    }


    async ngOnInit() {
        this.editor = new Editor();

        this.searchForm = new FormGroup( {
            'search' : new FormControl("")
        });




        const control = this.searchForm.get('search')
        control.valueChanges.subscribe( ( value : any ) => { this.doOnSearchChange( value ) } );


        this.inRemoveMode = false ;

        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];

        if (this.route.snapshot.params['collectionName'])
            this.currentCollectionName = this.route.snapshot.params['collectionName'];


        this.backRouter = '/main/list/' + this.currentCollectionName ;
        this.currentCollection = this.engineService.getListByName( this.currentCollectionName );

        this.title = this.engineService.getMenuByCollectionName(this.currentCollectionName).label;

        // Générateur de Form
        let formObj : any = {}

        for ( let field of this.currentCollection.formFields )
           formObj[ field.name ] = new FormControl('')

        this.form = new FormGroup( formObj );


        this.engineFormCollections = await this.engineService.getFormCollectionsFromEngineCollection( this.currentCollection );
        this.currentDocument = await this.engineService.composeFormDocument(   this.currentCollection , this.currentId  ,  this.engineFormCollections);

        this.form.patchValue(  this.currentDocument );



    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }


    async doRemove() {

        if (this.currentId != '')
            await this.engineService.deleteDocument(this.currentCollectionName ,  this.currentId);


        await this.router.navigate(['/main/collection/' + this.currentCollectionName ]);

    }

    async changeToggleEvent($event: any) {
    }


    async doValid() {


        try {

            let obj: any = { ...this.virtualFieldsModified };

            for ( let field of this.currentCollection.formFields ) {

                if ( !field.readonly && field.type != EngineDocumentFieldType.virtual )
                    obj [ field.name ] = this.form.get( field.name ).value;
            }

            this.engineService.updateDocument ( this.currentCollectionName , this.currentId, obj );

            console.log( obj );
        } catch (e) {

            console.error("doValid", e);
        }
         this.router.navigate(['/main/collection/' + this.currentCollectionName ]);
    }

    async selectImage() {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt,
                promptLabelHeader: "Sélectionner une photo",
                promptLabelPicture: "Prendre une photo",
                promptLabelPhoto: "Depuis les photos",
                promptLabelCancel: "Annuler"
            });
            if (image && image.dataUrl) {
                this.currentImageUrl = image.dataUrl;
                this.currentImageUrl = await this.storageService.uploadImage(image.dataUrl, '',);

            }
        } catch (e) {
            console.error('selectImage', e);

        }
    }

    doSearchInField ( fieldName : string = "") {
        this.searchInField = fieldName;
        this.searchItems = [];
        this.searchForm.get('search').reset();

        if ( fieldName != '' ) {
            setTimeout( () => {
                this.searchInput.setFocus();
            } , 50 );
        }

    }

    async doOnSearchChange ( value : any ) {

        let c : IEngineDocumentField | null = this.engineService.findFieldInDocumentFields (
            this.searchInField , this.currentCollection.formFields );

        if ( c &&  c.virtual && this.engineFormCollections ) {
            let items: any[]  =
                this.engineFormCollections.searchInCollection( c.virtual.fromCollection, value , [ c.virtual.fromField ] , 10);

            this.searchItems = [];

            for ( let item of items ) {



                let itemSelector : ItemSelector = new ItemSelector( item );
                itemSelector.name =  item[ c.virtual.fromField ];
                itemSelector.data = item;

                this.searchItems.push( itemSelector );
            }

        }
    }

    doOnItemSelector ( itemSelector : any ) {


        let c : IEngineDocumentField | null = this.engineService.findFieldInDocumentFields (
            this.searchInField , this.currentCollection.formFields );

        if ( c &&  c.virtual && this.engineFormCollections ) {

            let documentFrom = itemSelector[0].data;

            this.virtualFieldsModified [ c.virtual.id ] =
                documentFrom[c.virtual.fromId];

            let value = documentFrom[c.virtual.fromField];
            let obj: any = {};
            this.currentDocument[ c.name ] = value
        }

        this.doSearchInField();
    }


    protected readonly AppComponent = AppComponent;
    protected readonly EngineDocumentFieldType = EngineDocumentFieldType;
}
