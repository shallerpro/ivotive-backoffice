import {inject, Injectable} from '@angular/core';
import {HostModel} from "../models/host.model";
import {Observable} from "rxjs";
import {
  collection,
  collectionData, deleteDoc,
  doc,
  Firestore,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {SettingsService} from "./settings.service";
import {SearchResultModel} from "../models/search-result.model";
import {ToJSONPattern} from "../models/default.model";
import {PostModel} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class SearchReplaceService {

  private firestore: Firestore = inject(Firestore);
  private settings: SettingsService = inject(SettingsService);
  constructor() { }

  getSegment ( model : SearchResultModel) {

    let segment : string = model.content.slice( model.segmentStart , model.segmentStart + model.segmentLength  );
    return segment;


  }


  async changeSearch ( search : string , host : HostModel ) {
    try {
      const ref: any = doc(this.firestore, this.settings.HOST_COLLECTION, host.id);
      host.search = search ;
      host.searchInProgress = true ;
      await updateDoc( ref, host.toJSON(['search', 'searchInProgress'] , ToJSONPattern.only));
    } catch (e) {
      console.error("changeSearch", e);
    }
  }

  async get(id: string) {
    try {
      let ref: any = doc(this.firestore, this.settings.SEARCH_RESULT_COLLECTION, id);

      if (ref) {
        let snapshot = await getDoc(ref);
        return  new SearchResultModel(snapshot.data(), snapshot.id);
      }
    } catch (e) {
      console.error("get", e);
    }

    return null;
  }

  async edit( model : SearchResultModel ) {
    try {
      const ref: any = doc(this.firestore, this.settings.SEARCH_RESULT_COLLECTION, model.id);
      let ret: any = await updateDoc( ref, model.toJSON(['content'] , ToJSONPattern.only));
      return ret;
    } catch (e) {
      console.error("edit", e);
    }
  }


  async delete( model : SearchResultModel ) {
    try {
      const ref: any = doc(this.firestore, this.settings.POST_COLLECTION, model.id);
      await deleteDoc(ref);

    } catch (e) {
      console.error("delete", e);
    }
  }


  getObservable(host: HostModel): Observable<SearchResultModel[]> {

    const ref = collection(this.firestore, this.settings.SEARCH_RESULT_COLLECTION);
    const collectionDate : any = query(ref, where('hostId', '==', host.id));

    return collectionData(collectionDate , { idField :  'id' } );
  }


}
