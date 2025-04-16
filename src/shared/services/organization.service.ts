import {inject, Injectable} from '@angular/core';
import {HostModel} from "../models/host.model";
import {addDoc, collection, doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {SettingsService} from "./settings.service";
import {OrganizationModel} from "../models/organization.model";
import {PostModel} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  private firestore: Firestore = inject(Firestore);
  private settings : SettingsService = inject(SettingsService);


  constructor() { }


  async getById ( id : string ) {
    const ref : any = doc(this.firestore, this.settings.ORGANIZATION_COLLECTION , id );
    if ( ref ) {
      let snapshot = await getDoc( ref );
      return new OrganizationModel ( snapshot.data() , snapshot.id );
    }
    return false ;
  }

  async add(organization :  OrganizationModel ) {
    const ref = collection(this.firestore, this.settings.ORGANIZATION_COLLECTION);
    let ret: any = await addDoc(ref, organization.toJSON(['id']));
    return ret;
  }


  async edit( organization :  OrganizationModel ) {
    try {
      const ref: any = doc(this.firestore, this.settings.ORGANIZATION_COLLECTION, organization.id);
      let ret: any = await setDoc(ref, organization.toJSON(['id']), {merge: true});
      return ret;
    } catch (e) {
      console.error("edit organization", e);
    }
  }
}
