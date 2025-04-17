import {EngineDocumentFieldType, IEngineSettings} from "../shared/interfaces/engine-settings.interface";


export const engineSettings : IEngineSettings = {
    name : 'Administation BàO ',
    adminRoleName : 'admin',
    menus: [
                { label: 'Mise en relation' ,  collectionName : 'suggests'},
                { label: 'Utilisateurs', collectionName: 'users'}
    ],

    collections : [
        { name : 'suggests' ,
          fieldOrderAsc : 'updatedAt',
          gridFields : [
              { label : 'Contact 1' ,  name : 'contact1' ,type : EngineDocumentFieldType.default  , width : '20%' ,
                  virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact1Id" }},
              { label : 'Contact 2' , name : 'contact2' ,type : EngineDocumentFieldType.default  , width : '20%' ,
                  virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact2Id" }},
              { label : 'Msg' , name : 'message' , type : EngineDocumentFieldType.default  , width : '100%'},

              { label : 'Status' , name : 'state' , type : EngineDocumentFieldType.default , width : '10%' }],
            formFields : [
                { name : 'message' , type : EngineDocumentFieldType.default },
                { name : 'note' , type : EngineDocumentFieldType.default },
            ]
        },

        { name : 'users' ,
            fieldOrderAsc : 'createdAt',
            gridFields : [
                { label : '' , name : 'image' , type : EngineDocumentFieldType.image  , width : '80px'},
                { label : 'Name' , name : 'companyName' , type : EngineDocumentFieldType.default , width : '200px' }],
            formFields : [
                { name : 'message' , type : EngineDocumentFieldType.default },
                { name : 'note' , type : EngineDocumentFieldType.default },
            ]
        },
    ]
};
