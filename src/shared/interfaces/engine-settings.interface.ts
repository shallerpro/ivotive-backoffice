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
    name : string;
    type : EngineDocumentFieldType;
    width : string;
}

interface IEngineCollection {
    name : string;
    fieldOrderAsc : string;
    gridFields : IEngineCollectionField[];
    formFields : IEngineDocumentField[];
}


interface IEngineSettings {
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
    EngineDocumentFieldType
}