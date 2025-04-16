import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonButton, IonCol, IonContent, IonIcon, IonInput, IonItem, IonList, IonRow} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {StripHtmlPipe} from "../../../../shared/pipes/strip-html.pipe";
import {HostModel} from "../../../../shared/models/host.model";
import {UserService} from "../../../../shared/services/user.service";
import {HostService} from "../../../../shared/services/host.service";
import {UserModel} from "../../../../shared/models/user.model";
import {Router} from "@angular/router";
import { addIcons } from 'ionicons';
import { search, lockClosed } from 'ionicons/icons';
import {SearchReplaceService} from "../../../../shared/services/search-replace.service";
import {Observable} from "rxjs";
import {SearchResultModel} from "../../../../shared/models/search-result.model";
import {doc, Firestore, onSnapshot} from "@angular/fire/firestore";
import {SettingsService} from "../../../../shared/services/settings.service";

@Component({
    templateUrl: './replace-list.page.html',
    styleUrls: ['./replace-list.page.scss'],
    imports: [IonContent, CommonModule, FormsModule, HeaderComponent, IonItem, IonList, StripHtmlPipe,
        IonInput, IonButton, IonIcon, IonCol, IonRow]
})



export class ReplaceListPage implements OnInit {

  public  items$? : Observable<SearchResultModel[]>;
  public  items : SearchResultModel[] = [];
  public  host? : HostModel ;
  public  search : string = "";
  public  searchInProgress : boolean = false;
  private userService: UserService = inject(UserService);
  private firestore : Firestore = inject(Firestore);
  private settings : SettingsService = inject(SettingsService);
  private searchReplaceService: SearchReplaceService = inject(SearchReplaceService);
  private readonly router: Router = inject(Router);

  constructor() {

    addIcons({ search, lockClosed });
      this.userService.obsCurrentHost().subscribe(async (host) => {
      if (host) {
        this.search = host.search;
        await this.init(host);

        onSnapshot(doc(this.firestore, this.settings.HOST_COLLECTION , host.id ), (snapshot: any) => {
          // document listener
          let host: HostModel = new HostModel(snapshot.data(), snapshot.id);
          this.searchInProgress = host.searchInProgress;
          this.search = host.search;
        })
      }
    });
  }

  async ngOnInit() {

  }

  async init(host: HostModel) {
    this.host = host;
    this.items$ = this.searchReplaceService.getObservable(host);

   this.items$.subscribe(async ( items ) => {

     this.items = [];

     for ( let item of items ) {
       let s : SearchResultModel = new SearchResultModel(item);
       s.raw.segment = this.searchReplaceService.getSegment( s );
       this.items.push( s );
     }

    });



  }


  async doEdit( id : string) {
    await this.router.navigate(['/replace-edit', {id: id }]);
  }


  async doSearch () {

    if  ( this.host ) {
      await this.searchReplaceService.changeSearch(this.search , this.host);
    }

  }



}
