
import {inject, Injectable} from '@angular/core';
import {
  collection, collectionData, doc,
  Firestore, getDoc, getDocs, orderBy, query, where,
} from "@angular/fire/firestore";

import {engineSettings} from "../../environments/engine.settings";
import {
  IEngineCollection,
  IEngineCollectionVirtualField,
  IEngineDocumentField
} from "../interfaces/engine-settings.interface";


export interface ICollection {
  name : string;
  items : any[];
}


export class EngineCollections {

  private collections : ICollection[] = [];
  private firestore : Firestore;


  constructor( f: Firestore ) {
    this.firestore = f;
  }

  indexOf ( name: string  ) {
    for ( let i = 0; i < this.collections.length; i++ ) {
      if ( this.collections[i].name === name ) return i;
    }
    return -1;
  }

  async find ( name : string , field : string , value : string ) {
    let collection : any | null = this.get ( name );

    if ( collection ) {
      for (let i = 0; i < collection.items.length; i++) {
        let item = collection.items[i];

        if ( item[ field ] === value ) return item;

      }

      return null ;
    }


  }
  async query( name : string , fieldOrderAsc = "" ) {
    const items: any[] = [];
    try {
      const collectionRef = collection(this.firestore, name);

      let collectionQuery =  query(collectionRef);
      if ( fieldOrderAsc ) {
        collectionQuery = query(collectionRef , orderBy ( fieldOrderAsc  , 'asc') );
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
  async add(  name : string , fieldOrderAsc = "" ) {
    let items : any = null;
    if ( this.indexOf( name  ) === -1 ) {
      items =  await this.query( name , fieldOrderAsc );
      this.collections.push( { name : name , items : items } )
    }
    return items;
  }

  get ( name : string )  {
    if ( this.indexOf( name ) != -1 ) {
      return this.collections [ this.indexOf( name )]
    }
    return null;
  }
}


@Injectable({
  providedIn: 'root'
})
export class EngineService {

  public  settings : any = engineSettings;
  private firestore: Firestore = inject(Firestore);

  constructor( ) { }

  getName() {
    return this.settings.name;
  }

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


  async getDocument ( collectionName : string , documentId : string , filters : IEngineDocumentField[] ) {
    let ret : any = {}
    try {
      const ref: any = doc(this.firestore, collectionName, documentId);
      let d: any = await getDoc(ref);
      let obj = {id: d.id, ...d.data()}

      for ( let f of filters ) {
        ret [ f.name ] = obj [ f.name ];
      }



    } catch (e) {
      console.error ( e );
    }

    return ret;
  }


  /*
  async getPostById(id: string) {
    let postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, id);

    if (postRef) {
      let snapshot = await getDoc(postRef);
      let post: PostModel = new PostModel(snapshot.data(), snapshot.id);

      post.catIds = [];

      if (post.raw.catRefs)
        for (let cat of post.raw.catRefs)
          post.catIds.push(cat.id);


      return post;
    }

    return null;
  }

  async getPostsByHost(host: HostModel) {

    const postRef = collection(this.firestore, this.settings.POST_COLLECTION);
    const postQuery = query(postRef, where('hostId', '==', host.id));

    const docs = await getDocs(postQuery);
    const posts: PostModel[] = [];

    docs.docs.map(doc => {
      posts.push(new PostModel(doc.data(), doc.id));
    });

    return posts;


  }

  async addPost(host: HostModel, post: PostModel) {
    const postRef = collection(this.firestore, this.settings.POST_COLLECTION);
    let ret: any = await addDoc(postRef, post.toJSON(['id']));
    return ret;
  }


  async editPost(post: PostModel) {
    try {
      const postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, post.id);
      let ret: any = await setDoc(postRef, post.toJSON(['id', 'wpId', 'organizationRef', 'hostRef']), {merge: true});
      return ret;
    } catch (e) {
      console.error("editPost", e);
    }
  }

  async deletePost(postId: string) {
    try {
      const postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, postId);
      await deleteDoc(postRef);

    } catch (e) {
      console.error("deletePost", e);
    }
  }
  */

  getCollectionByName ( collectionName : string ) {
    for (let i = 0; i < this.settings.collections.length; i++) {
      if (collectionName === this.settings.collections[i].name) {
        return this.settings.collections[i];
      }
    }
  }

  async composeGridCollection ( collection : IEngineCollection ) {
    let items = [];
    try {
      let collections: EngineCollections = new EngineCollections( this.firestore );
      items = await collections.add(collection.name, collection.fieldOrderAsc);

      // Récupération des collections
      for (let i = 0; i < collection.gridFields.length; i++) {

        let virtual: IEngineCollectionVirtualField | undefined = collection.gridFields[i].virtual;

        if (virtual)
          await collections.add(virtual.fromCollection);
      }



      // Création des champs virtuals
      for (let i = 0; i < items.length; i++) {

        let item : any = items[i];

        for (let j = 0; j < collection.gridFields.length; j++) {
          let field : any = collection.gridFields[j]
          let virtual: IEngineCollectionVirtualField | undefined = field.virtual;

          if (virtual) {
            let searchValue = item [  virtual.id  ];
            let value : any = await collections.find( virtual.fromCollection , virtual.fromId , searchValue  );
            item[ field.name ] = value [ virtual.fromField ];
          }
        }

      }

    } catch (e) {
      console.log ( e );
    }


   return items;
  }
}
