
import {inject, Injectable} from '@angular/core';
import {
  collection, collectionData,
  Firestore, getDocs, orderBy, query, where,
} from "@angular/fire/firestore";

import {engineSettings} from "../../environments/engine.settings";
import {IEngineCollection} from "../interfaces/engine-settings.interface";
import {IdModel} from "../models/id.model";


@Injectable({
  providedIn: 'root'
})
export class EngineService {


  private firestore: Firestore = inject(Firestore);
  public  settings : any = engineSettings;

  constructor( ) { }


  getMenus() {
    return this.settings.menus;
  }

  getMenuByCollectionName ( collectionName : string ) {
    for ( let i = 0; i < this.settings.menus.length; i++ ) {
      if ( collectionName === this.settings.menus[i].collectionName ) {
        return this.settings.menus[i]
      }
    }

    return null;
  }

  getCollectionByCollectionName ( collectionName : string ) {
    for (let i = 0; i < this.settings.collections.length; i++) {
      if (collectionName === this.settings.collections[i].name) {
        return this.settings.collections[i];
      }
    }
  }

  async getCollection( c : IEngineCollection )
    {
      const items: any[] = [];
      try {
        const collectionRef = collection(this.firestore, c.name);

        let collectionQuery =  query(collectionRef);
        if ( c.fieldOrderAsc ) {
          collectionQuery = query(collectionRef , orderBy ( c.fieldOrderAsc  , 'asc') );
        }


        const docs = await getDocs(collectionQuery);


        docs.docs.map(doc => {
          let data: any = doc.data();
          data.id = doc.id;
          items.push( data );
        });
      } catch (e) {
        console.log ( e );
      }

      return items;
    }

}
