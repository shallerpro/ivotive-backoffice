import {inject, Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
import {HostModel} from "../models/host.model";
import {SettingsService} from "./settings.service";
import {Observable} from "rxjs";
import {CustomDataModel} from "../models/custom-data.model";
import {ToJSONPattern} from "../models/default.model";

@Injectable({
  providedIn: 'root'
})
export class CdService {

  private firestore: Firestore = inject(Firestore);
  private settings: SettingsService = inject(SettingsService);


  constructor() {
  }

  async getCustomDataByHost(host: HostModel) {

    const ref = collection(this.firestore, this.settings.CUSTOM_DATA_COLLECTION);
    const cdQuery = query(ref, where('hostId', '==', host.id));

    const docs = await getDocs(cdQuery);
    const customDatas: CustomDataModel[] = [];

    docs.docs.map(doc => {
      customDatas.push(new CustomDataModel(doc.data(), doc.id));
    });

    return customDatas;


  }

  async editCD( cd: CustomDataModel) {
    try {
      const ref: any = doc(this.firestore, this.settings.CUSTOM_DATA_COLLECTION, cd.id);
      let ret: any = await setDoc(ref, cd.toJSON(['value'] , ToJSONPattern.only), {merge: true});
      return ret;
    } catch (e) {
      console.error("editPost", e);
    }
  }



  async getCustomDataById(id: string) {
    let ref: any = doc(this.firestore, this.settings.CUSTOM_DATA_COLLECTION, id);

    if (ref) {
      let snapshot = await getDoc(ref);
      let cd: CustomDataModel = new CustomDataModel(snapshot.data(), snapshot.id);

      return cd;
    }

    return null;
  }

  getCustomDataObservable (host: HostModel): Observable<any[]> {

    const cdRef = collection(this.firestore, this.settings.CUSTOM_DATA_COLLECTION);
    const cdQuery = query(cdRef, where('hostId', '==', host.id));

    return collectionData(cdQuery);
  }



}
