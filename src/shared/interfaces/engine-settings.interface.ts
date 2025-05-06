interface IEngineMenu {
    label: string;
    listName : string ;
}


enum EngineDocumentFieldType {
    default = 0,
    image = 1 ,
    wysiwig = 2,
    textarea = 3,
    checkbox = 4,
    virtual = 5,
    images = 6
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


interface IEngineListField {
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


interface IEngineCollectionFilter {
    field : string;
    value : string;
}


interface IEngineList {
    name : string;
    collectionName : string;
    fieldOrderAsc : string;
    filter? : IEngineCollectionFilter;
    listFields : IEngineListField[];
    formFields : IEngineDocumentField[];
}


interface IEngineSettings {
    name : string;
    adminRoleName : string;
    menus : IEngineMenu[];
    lists : IEngineList[];
}




export {
    IEngineMenu,
    IEngineSettings,
    IEngineDocumentField,
    IEngineList,
    IEngineCollectionFilter,
    IEngineListField,
    IEngineCaseField,
    EngineDocumentFieldType,
    IEngineCollectionVirtualField
}