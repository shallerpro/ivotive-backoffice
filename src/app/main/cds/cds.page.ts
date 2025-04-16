import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

import {IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonThumbnail} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {add, reorderThreeOutline} from "ionicons/icons";

import {Observable} from "rxjs";
import {NgStyle} from "@angular/common";
import {StripHtmlPipe} from "../../../shared/pipes/strip-html.pipe";
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ItemSelectorComponent} from "../../../shared/components/item-selector/item-selector.component";
import {CustomDataModel} from "../../../shared/models/custom-data.model";
import {CategorieModel} from "../../../shared/models/categorie.model";
import {CdService} from "../../../shared/services/cd.service";
import {UserService} from "../../../shared/services/user.service";
import {HostService} from "../../../shared/services/host.service";
import {HostModel} from "../../../shared/models/host.model";
import {CdSectionModel} from "../../../shared/models/cd-section.model";



@Component({
    selector: 'cds-posts',
    templateUrl: 'cds.page.html',
    styleUrls: ['cds.page.scss'],
    standalone : true ,
    imports: [IonContent, IonList, IonItem, StripHtmlPipe, IonFab, IonFabButton, IonIcon, IonThumbnail, HeaderComponent, ItemSelectorComponent, NgStyle, RouterLink]
})
export class CdsPage implements OnInit {

    public currentHostName = '';
    public items: CustomDataModel[] = [];
    public filteredItems: CustomDataModel[] = [];
    public sections: CdSectionModel[] = [];
    private readonly cdService: CdService = inject(CdService);
    private readonly userService: UserService = inject(UserService);
    private readonly hostService: HostService = inject(HostService);
    private readonly router: Router = inject(Router);
    private refresh$: Observable<any> | null = null;

    constructor() {
        addIcons({add, reorderThreeOutline});

        this.userService.obsCurrentHost().subscribe(async (host) => {
            if (host) {
                await this.init(host);
            }
        });
    }


    async applyFilter ( filter = "" )  {

        this.filteredItems = [];

        if ( filter === "" ) {
            this.filteredItems = this.items;
        } else {

            this.items.map ( ( f ) => {
                if ( f.section === filter )
                    this.filteredItems.push ( f )
            })
        }

    }


    async onSelectSection( sections : any ) {
        console.log(sections)

        if ( sections[0].raw.all ) {
           await this.applyFilter()
        } else {
            await this.applyFilter( sections[0].name );
        }



    }

    async init(host: HostModel) {

        let items: any = await this.cdService.getCustomDataByHost(host);
        this.currentHostName = host.url;

        this.refresh$ = this.cdService.getCustomDataObservable(host);

        this.refresh$.subscribe(async () => {
            console.log("refresh");

            this.items = await this.cdService.getCustomDataByHost(host);

            let section : CdSectionModel = new CdSectionModel();
            section.name = "Tout";
            section.raw.selected = true ;
            section.raw.all = true;

            let sections: CdSectionModel[] = [ section ];

            function exist ( s : string ) {
                for ( let section of sections) {
                    if ( section.name === s ) return true;
                }
                return false;
            }

            this.sections = [];

            for ( let item of this.items ) {
                if ( !exist ( item.section ) )
                    sections.push ( new CdSectionModel( { name : item.section } ));

            }

            this.sections = sections;

        });

        this.items = items;
        this.applyFilter();
    }

    async ngOnInit() {

    }


    async doEdit( customDataId : string) {
        await this.router.navigate(['/main/cd' , {id : customDataId}]);
    }

}
