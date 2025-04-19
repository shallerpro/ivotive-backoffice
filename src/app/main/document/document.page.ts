import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonRow,
    IonTextarea,
    IonToggle
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {arrowBackOutline, chevronDownOutline, chevronUpOutline} from "ionicons/icons";
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
import {EngineService} from "../../../shared/services/engine.service";
import {EngineDocumentFieldType, IEngineCollection} from "../../../shared/interfaces/engine-settings.interface";


@Component({
    selector: 'app-collection-edit',
    templateUrl: './document.page.html',
    standalone: true,
    styleUrls: ['./document.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule]
})
export class DocumentPage implements OnInit, OnDestroy {

    public form : any ;
    public title = "";
    public currentImageUrl = "";
    public editor!: Editor;
    public currentId = "";
    public currentCollectionName = "";
    public currentDocument : any = {}
    public backRouter = "";
    public currentCollection  : any ;
    private route = inject(ActivatedRoute);
    private engineService : EngineService = inject(EngineService);
    private storageService: StorageService = inject(StorageService);
    public isPublished : boolean = false;


    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})

    }

    /*
    async init(host: HostModel) {




/*
        if (this.currentId) {

            this.title = "Editer un article"
            let post: PostModel | null = await this.postService.getPostById(this.currentId);

            if (post) {

                this.isPublished = post.published;
                this.currentImageUrl = post.imageUrl;
                this.postForm.patchValue(
                    {
                        title: post.title,
                        content: post.content,
                        isAi: false
                    }
                )


                if (post.catIds) {

                    for (let category of this.categories) {

                        for (let selectedCategory of post.catIds) {

                            console.log(selectedCategory, category);

                            if (category.id == selectedCategory) category.raw.selected = true;
                        }

                    }
                }

            }


        } else {

            this.postForm.patchValue({});
        }


    }
*/
    async ngOnInit() {
        this.editor = new Editor();

        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];

        if (this.route.snapshot.params['collectionName'])
            this.currentCollectionName = this.route.snapshot.params['collectionName'];


        this.backRouter = '/main/collection/' + this.currentCollectionName ;
        this.currentCollection = this.engineService.getCollectionByName( this.currentCollectionName );

        // Générateur de Form
        let formObj : any = {}

        for ( let field of this.currentCollection.formFields )
           formObj[ field.name ] = new FormControl('')

        this.form = new FormGroup( formObj );

        this.currentDocument = await this.engineService.getDocument(
            this.currentCollectionName , this.currentId , this.currentCollection.formFields );

        this.form.patchValue(  this.currentDocument );



    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    async doRemove() {
/*
        if (this.currentId != '')
            await this.postService.deletePost(this.currentId);

        await this.router.navigate(['/main/posts'])

 */
    }

    async changeToggleEvent($event: any) {
    }


    async doValid() {

        /*
        try {
            let post: PostModel = new PostModel();

            if (this.postForm?.value?.isAi) {
                post.AiPattern = this.postForm.value.aiPattern ? this.postForm.value.aiPattern : "";
            } else {
                post.title = this.postForm.value.title ? this.postForm.value.title : "";
                post.content = this.postForm.value.content ? this.postForm.value.content : "";
            }

            post.catIds = [];

            for (let category of this.categories) {

                if (category.raw.selected) {
                    post.catIds.push( category.id);
                }

            }


            if (this.userService.currentHostRef)
                post.hostId = this.userService.currentHostRef.id;


           if (  this.userService.currentUser ) {
                post.organizationId = this.userService.currentUser.organizationId;
            }

            post.imageUrl = this.currentImageUrl;
            post.published = this.isPublished;

            if (this.currentId != '') {
                post.id = this.currentId;
                await this.postService.editPost(post);

            } else {
                const currentHost = this.userService.getCurrentHost();
                if (currentHost)
                    await this.postService.addPost(currentHost, post);
            }

            await this.router.navigate(['/main/posts']);
        } catch (e) {

            console.error("doAddPost", e);
        }*/
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

    /*

    onSelectCategories(categories: CategorieModel[]) {
        this.categories.forEach((category: CategorieModel) => {
            category.raw.selected = !!categories.find((s: CategorieModel) => s.id == category.id);
        });
    }

     */




    protected readonly AppComponent = AppComponent;
    protected readonly EngineDocumentFieldType = EngineDocumentFieldType;
}
