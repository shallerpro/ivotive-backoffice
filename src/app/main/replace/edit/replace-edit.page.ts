import {Component, inject, OnDestroy, OnInit} from '@angular/core';
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
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../../shared/components/item-selector/item-selector.component";
import {UserService} from "../../../../shared/services/user.service";
import {HostModel} from "../../../../shared/models/host.model";
import {Editor, NgxEditorModule} from "ngx-editor";
import {AppComponent} from "../../../app.component";
import {SearchReplaceService} from "../../../../shared/services/search-replace.service";
import {SearchResultModel} from "../../../../shared/models/search-result.model";
import {ToJSONPattern} from "../../../../shared/models/default.model";



@Component({
    selector: 'cds-edit-cds',
    templateUrl: './replace-edit.page.html',
    styleUrls: ['./replace-edit.page.scss'],
    imports: [IonContent, IonToggle, IonButton, ReactiveFormsModule, IonRow, IonTextarea, HeaderComponent, ItemSelectorComponent, IonInput, IonIcon, IonItem, NgxEditorModule]
})
export class ReplaceEditPage  {

    public form = new FormGroup({
        title: new FormControl(''),
        content: new FormControl(''),
        contentModified: new FormControl(''),
    });

    public editor!: Editor;

    public currentId: string = "";
    private router: Router = inject(Router);
    private route = inject(ActivatedRoute);
    private userService: UserService = inject(UserService);
    private searchReplaceService: SearchReplaceService = inject(SearchReplaceService);

    constructor() {
        addIcons({arrowBackOutline, chevronDownOutline, chevronUpOutline})
        this.userService.obsCurrentHost().subscribe(async (host : any) => {
            if (host)
                await this.init(host);

        });
    }

    async init(host: HostModel) {


        if (this.route.snapshot.params['id'])
            this.currentId = this.route.snapshot.params['id'];


        if (this.currentId) {

            let rs : SearchResultModel | null = await this.searchReplaceService.get(this.currentId);


            if (rs)
                this.form.patchValue( {
                    title : rs.title,
                    content : this.searchReplaceService.getSegment( rs )
                } );


        } else

            this.form.patchValue({});



    }


    async doValid() {

        try {

            let sr: SearchResultModel | null = await this.searchReplaceService.get ( this.currentId );

            if ( sr ) {

                sr.id = this.currentId;

                let content : string =
                  sr.content.substring( 0 , sr.segmentStart  ) +
                  this.form.value.contentModified +
                    sr.content.substring( sr.segmentStart + sr.segmentLength  , sr.content.length ) ;

                sr.content = content;
                await this.searchReplaceService.edit(sr);

            }

            await this.router.navigate(['replace-list']);
        } catch (e) {

            console.error("doValid", e);
        }
    }


    protected readonly AppComponent = AppComponent;
}
