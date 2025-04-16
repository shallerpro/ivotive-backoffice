import {Host, inject, Injectable} from '@angular/core';
import {UserModel} from "../models/user.model";
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs, onSnapshot,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
import {HostModel} from "../models/host.model";
import {SettingsService} from "./settings.service";
import {CategorieModel} from "../models/categorie.model";
import {PostModel} from "../models/post.model";
import {BehaviorSubject, Observable, Subscriber} from "rxjs";
import {DocumentReference} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class HostService {


  private firestore: Firestore = inject(Firestore);
  private settings : SettingsService = inject(SettingsService);

  constructor() { }


  async getHostById ( id : string ) {
    const ref : any = doc(this.firestore, this.settings.HOST_COLLECTION , id );
    if ( ref ) {
      let snapshot = await getDoc( ref );
      return new HostModel( snapshot.data() , snapshot.id );
    }
    return false ;
  }

  async edit( host :  HostModel ) {
    try {
      const ref: any = doc(this.firestore, this.settings.HOST_COLLECTION, host.id);
      let ret: any = await setDoc(ref, host.toJSON(['id', 'key']), {merge: true});
      return ret;
    } catch (e) {
      console.error("edit", e);
    }
  }


  async delete( id : string ) {
    try {
      const ref: any = doc(this.firestore, this.settings.HOST_COLLECTION, id);
      await deleteDoc(ref);

    } catch (e) {
      console.error("delete", e);
    }
  }

  async add( host :  HostModel ) {
    const ref = collection(this.firestore, this.settings.HOST_COLLECTION);
    let ret: any = await addDoc( ref, host.toJSON(['id']));
    return ret;
  }

  async getHostsByUser ( user : UserModel ) {

    const hostRef = collection(this.firestore, "hosts");
    const hostQuery = query ( hostRef , where('organizationId', '==', user.organizationId));

    const docs = await getDocs(hostQuery);
    const hosts : HostModel[] = [];

    docs.docs.map( doc => {
      hosts.push ( new HostModel( doc.data()  , doc.id ));
    }) ;

    return hosts;

  }

  async getCategoriesByHost  ( currentHost : HostModel  ){

    const categoryRef = collection(this.firestore, this.settings.CATEGORY_COLLECTION );
    const categoryQuery = query ( categoryRef , where('hostId', '==', currentHost.id ) );

    const docs = await getDocs(categoryQuery);
    const categories : CategorieModel[] = [];

    docs.docs.map( doc => {
      categories.push ( new CategorieModel( doc.data()  , doc.id ));
    }) ;

    return categories;
  }


}
