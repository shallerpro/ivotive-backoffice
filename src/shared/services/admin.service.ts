import {PostModel} from "../models/post.model";
import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";

import {SettingsService} from "./settings.service";
import {UserModel} from "../models/user.model";
import {HostModel} from "../models/host.model";


@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private firestore: Firestore = inject(Firestore);
  private settings: SettingsService = inject(SettingsService);



  constructor() { }


  async getUsers() {

    const ref : any   = collection(this.firestore, this.settings.USER_COLLECTION);
    const docs = await getDocs( ref );
    const items: UserModel[] = [];

    docs.docs.map(doc => {
      items.push(new UserModel(doc.data(), doc.id));
    });


    return items;
  }



   getOrganizations()  {
      const c = collection(this.firestore, this.settings.ORGANIZATION_COLLECTION);
      let q = query(c, ...[]);
      return collectionData(q, {idField: 'id'});
  }

   getHosts() {
    const c = collection(this.firestore, this.settings.HOST_COLLECTION);
    let q = query(c, ...[]);
    return collectionData(q, {idField: 'id'});

  }

}
