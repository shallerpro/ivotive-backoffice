interface IEngineMenu {
    label: string;
    collectionName : string ;
}


enum EngineDocumentFieldType {
    default = 0,
    image = 1 ,
    wysiwig = 2,
    textarea = 3,
    checkbox = 4,
    virtual = 5
}

interface IEngineDocumentField {
    label : string;
    name : string;
    type : EngineDocumentFieldType;
    readonly ? : boolean;
    cases ? : IEngineCaseField[];
    virtual? : IEngineCollectionVirtualField,
}

interface IEngineCaseField {
    value: string;
    name: string;
}


interface IEngineCollectionField {
    label : string;
    name : string;
    type : EngineDocumentFieldType;
    width : string;
    virtual? : IEngineCollectionVirtualField,
    cases? : IEngineCaseField[];
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
    IEngineCaseField,
    EngineDocumentFieldType,
    IEngineCollectionVirtualField
}