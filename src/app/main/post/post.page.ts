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
import {CategorieModel} from "../../../shared/models/categorie.model";
import {addIcons} from "ionicons";
import {arrowBackOutline, chevronDownOutline, chevronUpOutline} from "ionicons/icons";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {HostService} from "../../../shared/services/host.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {StorageService} from "../../../shared/services/storage.service";
import {PostModel} from "../../../shared/models/post.model";
import {doc, Firestore} from "@angular/fire/firestore";
import {PostService} from "../../../shared/services/post.service";
import {SettingsService} from "../../../shared/services/settings.service";
import {HostModel} from "../../../shared/models/host.model";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {AppComponent} from "../../app.component";
import {UserModel} from "../../../shared/models/user.model";


@Component({
    selector: 'app-posts-edit',
    templateUrl: './post.page.html',
    styleUrls: ['./post.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem, AngularEditorModule, NgxEditorModule]
})
export class PostPage implements OnInit, OnDestroy {

    public postForm = new FormGroup({
        aiPattern: new FormControl(''),
        title: new FormControl(''),
        content: new FormControl(''),
        isAi: new FormControl(true),
    });

    public title = "Ajouter un article";
    public editor!: Editor;

    public categories: CategorieModel[] = [];
    public currentId: string = "";
    public isPublished: boolean = true;
    public currentImageUrl: string = "";
    public durations: any[] = [
        {name: 'Illimité', value: 0, id: 0, raw: {selected: true}},
        {name: '1 jour', value: 1, id: 1, raw: {selected: false}},
        {name: '1 semaine', value: 7, id: 2, raw: {selected: false}},
        {name: '1 mois', value: 30, id: 3, raw: {selected: false}}];
    private firestore: Firestore = inject(Firestore);
    private settings: SettingsService = inject(SettingsService);
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    private location: Location = inject(Location);
    private storageService: StorageService = inject(StorageService);
    private userService: UserService = inject(UserService);
    private hostService: HostService = inject(HostService);
    private postService: PostService = inject(PostService);

    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
        this.userService.obsCurrentHost().subscribe(async (host) => {
            if (host)
                await this.init(host);

        });
    }

    get isAi() {
        return this.postForm?.value?.isAi;
    }

    doSwitchAiManuel() {
        this.postForm.get('isAi')?.setValue(!this.isAi);
    }

    async init(host: HostModel) {


        this.categories = await this.hostService.getCategoriesByHost(host);


        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];


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

    async ngOnInit() {
        this.editor = new Editor();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    async doRemove() {

        if (this.currentId != '')
            await this.postService.deletePost(this.currentId);

        await this.router.navigate(['/main/posts'])
    }

    async changeToggleEvent($event: any) {
        this.isPublished = $event.target.checked;
    }


    async doValid() {

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
        }
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

    onSelectCategories(categories: CategorieModel[]) {
        this.categories.forEach((category: CategorieModel) => {
            category.raw.selected = !!categories.find((s: CategorieModel) => s.id == category.id);
        });
    }

    onSelectDuration(durations: any) {
        this.durations.forEach((duration: any) => {
            duration.raw.selected = !!durations.find((s: any) => s.id == duration.id);
        });
    }





    protected readonly AppComponent = AppComponent;
}
