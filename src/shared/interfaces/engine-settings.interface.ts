interface IEngineMenu {
    label: string;
    collectionName : string ;
}


enum EngineDocumentFieldType {
    default = 0,
    image = 1 ,
    wysiwig = 2,
    checkbox = 3
}

interface IEngineDocumentField {
    name : string;
    type : EngineDocumentFieldType;
}

interface IEngineCollectionField {
    label : string;
    name : string;
    type : EngineDocumentFieldType;
    width : string;
    virtual? : IEngineCollectionVirtualField
}

interface IEngineCollectionVirtualField {
   fromCollection : string;
   fromField : string;
   fromId : string
   id : string;
}

interface IEngineCollection {
    name : string;
    fieldOrderAsc : string;
    gridFields : IEngineCollectionField[];
    formFields : IEngineDocumentField[];
}


interface IEngineSettings {
    name : string;
    adminRoleName : string;
    menus : IEngineMenu[];
    collections : IEngineCollection[];
}




export {
    IEngineMenu,
    IEngineSettings,
    IEngineDocumentField,
    IEngineCollection,
    IEngineCollectionField,
    EngineDocumentFieldType,
    IEngineCollectionVirtualField
}