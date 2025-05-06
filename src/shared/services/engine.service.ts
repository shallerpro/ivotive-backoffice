import {inject, Injectable} from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc, where,
} from "@angular/fire/firestore";

import {engineEnvironment} from "../../environments/engine-environment";
import {
  EngineDocumentFieldType,
  IEngineCaseField, IEngineCollectionFilter,
  IEngineCollectionVirtualField,
  IEngineDocumentField,
  IEngineList
} from "../interfaces/engine-settings.interface";


export interface ICollection {
  name : string;
  items : any[];
}


export class EngineCollections {

  private collections: ICollection[] = [];
  private firestore: Firestore;


  constructor(f: Firestore) {
    this.firestore = f;
  }

  indexOf(name: string) {
    for (let i = 0; i < this.collections.length; i++) {
      if (this.collections[i].name === name) return i;
    }
    return -1;
  }

  async find(name: string, field: string, value: string) {

    let collection: any | null = this.get(name);

    if (collection) {
      for (let i = 0; i < collection.items.length; i++) {
        let item = collection.items[i];

        if (item[field] === value) return item;

      }

      return null;
    }


  }

  async query(name: string, fieldOrderAsc = "" , filter ? : IEngineCollectionFilter ) {
    const items: any[] = [];
    try {
      const collectionRef = collection(this.firestore, name);
      let w: any[] = [];
      if (fieldOrderAsc)
        w.push ( orderBy(fieldOrderAsc, 'asc') );

     if ( filter )
       w.push ( where( filter.field , '==' , filter.value  ));

      let collectionQuery = query(collectionRef,  ...w );
      const docs = await getDocs(collectionQuery);

      docs.docs.map(doc => {
        let data: any = doc.data();
        data.id = doc.id;
        items.push(data);
      });
    } catch (e) {
      console.log(e);
    }

    return items;
  }

  async add(name: string, fieldOrderAsc = "" , filter?: IEngineCollectionFilter) {
    let items: any = null;
    if (this.indexOf(name) === -1) {
      items = await this.query(name, fieldOrderAsc , filter);
      this.collections.push({name: name, items: items})
    }
    return items;
  }

  get(name: string) {
    if (this.indexOf(name) != -1) {
      return this.collections [this.indexOf(name)]
    }
    return null;
  }

  searchInCollection(name: string, searchedValue: string, inFields: any[] = [] , maxItems = -1) {
    let searchItems: any[] = []

    let engineCollection: ICollection | null = this.get(name);

    if (engineCollection) {
      let items: any[] = engineCollection.items;

      searchItems = items.filter((item: any) => {

        if (searchedValue == '' || ( maxItems != -1 &&  searchItems.length > maxItems )) return false;

        try {

          for (let field of inFields) {
            let value: any = item[field];

            if (typeof value == 'string' && value.toUpperCase().indexOf(searchedValue.toUpperCase()) !== -1)
              return true ;
          }
        } catch (e) {
          console.error(e);
        }

        return null;
      })

    }
    return searchItems;


  }
}

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  public  settings : any = engineEnvironment;
  private firestore: Firestore = inject(Firestore);

  constructor( ) { }

  getName() {
    return this.settings.name;
  }

  getMenus() {
    return this.settings.menus;
  }


  getFirstRoute ( mainRoute = 'main/') {
    return mainRoute + 'list/' +  this.settings.menus[0].listName;
  }


  getMenuByListName ( listName : string ) {
    for ( let i = 0; i < this.settings.menus.length; i++ ) {
      if ( listName === this.settings.menus[i].listName ) {
        return this.settings.menus[i]
      }
    }

    return null;
  }



  returnFormatCases ( name : string , cases? : IEngineCaseField[] ) {
    let ret = name ;

    if ( cases ) {

      for (let i = 0; i < cases.length; i++) {
        if (name === cases[i].name) {
          ret = cases[i].value;
        }
      }
    }

    return ret ;
  }


   async updateDocument ( collectionName : string , documentId : string , data : { } ) {
     try {
       const ref: any = doc(this.firestore, collectionName, documentId);
       let d: any = await updateDoc(ref , data );
     } catch (e) {
       console.error(e);
     }
   }

  async getDocument ( collectionName : string , documentId : string , filters : IEngineDocumentField[] ) {
    let obj : any = {}
    try {
      const ref: any = doc(this.firestore, collectionName, documentId);
      let d: any = await getDoc(ref);
      obj = {id: d.id, ...d.data()}

      for ( let f of filters ) {

        let value = obj [ f.name ];
        if ( value == undefined )
          obj [ f.name ] = "";
      }



    } catch (e) {
      console.error ( e );
    }

    return obj;
  }


  async deleteDocument ( collectionName : string , documentId : string  ) {
    try {
      const ref: any = doc(this.firestore, collectionName, documentId);
      await deleteDoc(ref);

    } catch (e) {
      console.error ( e );
    }
  }

  getListByName (name : string ) {
    for (let i = 0; i < this.settings.lists.length; i++) {
      if ( name === this.settings.lists[i].name) {
        return this.settings.lists[i];
      }
    }
  }


  async getFormFromList (engineList : IEngineList  ) {

    let collections: EngineCollections = new EngineCollections(this.firestore);


    // Récupération des collections
    for (let i = 0; i < engineList.formFields.length; i++) {

      let virtual: IEngineCollectionVirtualField | undefined = engineList.formFields[i].virtual;

      if (virtual)
        await collections.add(virtual.fromCollection);
    }

    return collections;
  }

   findFieldInDocumentFields ( name : string , formFields : IEngineDocumentField[] ) {
    for ( let f of formFields ) {
      if ( f.name === name ) return f;
    }
    return null ;
  }

  async composeFormDocument ( collection : IEngineList , id : string , collections : EngineCollections | null = null  ) {
    let document: any = {};
    try {

      if ( !collections )
        collections = await  this.getFormFromList( collection );

      let fullDocument: any = await this.getDocument(collection.collectionName, id, collection.formFields);

      for (let j = 0; j < collection.formFields.length; j++) {
        let field: any = collection.formFields[j]
        let virtual: IEngineCollectionVirtualField | undefined = field.virtual;

        if (virtual) {
          let searchValue = fullDocument [virtual.id];
          let value: any = await collections.find(virtual.fromCollection, virtual.fromId, searchValue);
          if (value)
            fullDocument[ field.name ] = value [virtual.fromField];
        }
      }


      for (let j = 0; j < collection.formFields.length; j++) {
        let field: any = collection.formFields[j]
        document[field.name] =  fullDocument[field.name]
      }


    } catch (e) {
      console.log(e);
    }



    return document;
  }


  async composeGridCollection ( list : IEngineList ) {
    let items = [];
    try {
      let collections: EngineCollections = new EngineCollections( this.firestore );
      items = await collections.add(list.collectionName, list.fieldOrderAsc , list.filter);

      // Récupération des collections
      for (let i = 0; i < list.listFields.length; i++) {

        let virtual: IEngineCollectionVirtualField | undefined = list.listFields[i].virtual;

        if (virtual)
          await collections.add(virtual.fromCollection);
      }



      // Création des champs virtuals
      for (let i = 0; i < items.length; i++) {

        let item : any = items[i];

        for (let j = 0; j < list.listFields.length; j++) {
          let field : any = list.listFields[j];


          let virtual: IEngineCollectionVirtualField | undefined = field.virtual;

          if (virtual) {
            let searchValue = item [  virtual.id  ];
            let value : any = await collections.find( virtual.fromCollection , virtual.fromId , searchValue  );
            if ( value )
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
