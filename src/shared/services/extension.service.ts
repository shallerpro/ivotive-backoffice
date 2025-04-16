import {inject, Injectable} from '@angular/core';
import {HostModel} from "../models/host.model";
import {Firestore} from "@angular/fire/firestore";
import {SettingsService} from "./settings.service";
import {CustomFunctionRouting} from "../models/custom-function/custom-function-routing.model";
import {ExtensionCollectionHeader, ExtensionCollectionHeaderType} from "../models/extensions/collection-header.model";


@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  private firestore: Firestore = inject(Firestore);
  private settings: SettingsService = inject(SettingsService);

  //private http: HttpClient = inject(HttpClient);


  constructor() {
  }

  async getRouting(host: HostModel) {

    let routing: CustomFunctionRouting[] = [];

    if (host.debugCustomHttp) {
      routing.push(new CustomFunctionRouting({name: "Mise en relation", routing: "routing"}));
      routing.push(new CustomFunctionRouting({name: "Professionel", routing: "pro"}));
    }
    return routing;
  }


  async getHeaderCollection(host: HostModel, routing = "") {

    let headers: ExtensionCollectionHeader[] = []

    if (host.debugCustomHttp) {

      switch (routing) {

        case "routing" : {

          headers.push(new ExtensionCollectionHeader({
            name: "RoutingCol1",
            type: ExtensionCollectionHeaderType.image,
            field: "image"
          }));
          headers.push(new ExtensionCollectionHeader({
            name: "RoutingCol2",
            type: ExtensionCollectionHeaderType.default,
            field: "field1"
          }));
          headers.push(new ExtensionCollectionHeader({
            name: "RoutingCol3",
            type: ExtensionCollectionHeaderType.default,
            field: "field2"
          }));

          break;
        }

        case "pro" : {

          headers.push(new ExtensionCollectionHeader({
            name: "ProCol1",
            type: ExtensionCollectionHeaderType.html,
            field: "image"
          }));
          headers.push(new ExtensionCollectionHeader({
            name: "ProCol2",
            type: ExtensionCollectionHeaderType.default,
            field: "field1"
          }));
          headers.push(new ExtensionCollectionHeader({
            name: "ProCol3",
            type: ExtensionCollectionHeaderType.default,
            field: "field2"
          }));

          break;
        }

      }

    }

    return headers;


  }


  async getCollection(host: HostModel, routing = "") {

    let collections : any[] = []

    if (host.debugCustomHttp) {


      switch (routing) {

        case "pro" : {

          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );
          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );
          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );

          break;

        }

        case "routing" : {
          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );
          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );
          collections.push ( { image : 'https://placehold.co/600x400' , field1 : "Champ 1" , field2 : "Champ 2" } );

          break;
        }


      }
    }


    return collections;

  }
}