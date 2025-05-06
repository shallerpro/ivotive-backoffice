import {EngineDocumentFieldType, IEngineSettings} from "../shared/interfaces/engine-settings.interface";


export const engineEnvironment : IEngineSettings = {
    name : 'Administation BàO ',
    adminRoleName : 'admin',
    menus: [
                { label: 'Mise en relation' ,  listName : 'suggests'},
                { label: 'Pro', listName: 'pro'},
                { label: 'Utilisateurs', listName: 'users'}
    ],

    lists : [
        { name : 'suggests' ,
          collectionName :  'suggests',
          fieldOrderAsc : 'updatedAt',
          listFields : [
              { label : 'Contact 1' ,  name : 'contact1' ,type : EngineDocumentFieldType.virtual  , width : '20%' ,
                  virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact1Id" }},
              { label : 'Contact 2' , name : 'contact2' ,type : EngineDocumentFieldType.virtual  , width : '20%' ,
                  virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact2Id" }},
              { label : 'Msg' , name : 'message' , type : EngineDocumentFieldType.default  , width : '100%' },

              { label : 'Status' , name : 'state' , type : EngineDocumentFieldType.default , width : '10%' ,
                 cases : [
                     { name : 'PENDING' , value:  'En cours'} ,
                     { name : 'ACCEPTED' , value : 'Accepter' },
                     { name : 'COMPLETED' , value : 'Finalisé' }
                 ]}],
            formFields : [
                { label : 'ID'  , name : 'id' , type : EngineDocumentFieldType.default , readonly : true },
                { label : 'Contact 1' ,  name : 'contact1' ,type : EngineDocumentFieldType.virtual  ,
                    virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact1Id" }},
                { label : 'Contact 2' ,  name : 'contact2' ,type : EngineDocumentFieldType.virtual  ,
                    virtual : {  fromCollection : "users" ,  fromField : "displayName" ,  fromId : 'id' ,  id : "contact2Id" }},
                { label : 'Message'  , name : 'message' , type : EngineDocumentFieldType.default },
                { label : 'Note'  , name : 'note' , type : EngineDocumentFieldType.default },

            ]
        },

        { name : 'pro' ,
            fieldOrderAsc : 'createdAt',
            collectionName :  'users',
            filter : { field : 'role' , value : 'pro'},
            listFields : [
                { label : '' , name : 'companyImages' , type : EngineDocumentFieldType.images  , width : '80px'},
                { label : 'Name' , name : 'companyName' , type : EngineDocumentFieldType.default , width : '200px' }],
            formFields : [
                { label : 'ID'  , name : 'id' , type : EngineDocumentFieldType.default , readonly : true },
                { label : "Nom de l'entreprise" , name : 'companyName' , type : EngineDocumentFieldType.default },
                { label : "Email" , name : 'email' , type : EngineDocumentFieldType.default , readonly: true },
                { label : "Siret" , name : 'siret' , type : EngineDocumentFieldType.default },
                { label : "Adresse" , name : 'address' , type : EngineDocumentFieldType.default },
                { label : "Code Postal" , name : 'codePostal' , type : EngineDocumentFieldType.default },
                { label : "Ville" , name : 'city' , type : EngineDocumentFieldType.default },
                { label : "Description" , name : 'companyDescription' , type : EngineDocumentFieldType.textarea },
                { label : "Lien Facebook" , name : 'lienFacebook' , type : EngineDocumentFieldType.default },
                { label : "Lien Siteweb" , name : 'lienSite' , type : EngineDocumentFieldType.default },
                { label : "Images" , name : 'companyImages' , type : EngineDocumentFieldType.images },
                { label : "Activer" , name : 'enabled' , type : EngineDocumentFieldType.checkbox },
                { label : "En avant " , name : 'inTheNew' , type : EngineDocumentFieldType.checkbox },
                { label : "Compte Premium" , name : 'premium' , type : EngineDocumentFieldType.checkbox },
            ]
        },

        { name : 'users' ,
            fieldOrderAsc : 'createdAt',
            collectionName :  'users',
            filter : { field : 'role' , value : 'user'},
            listFields : [
                { label : '' , name : 'image' , type : EngineDocumentFieldType.image  , width : '80px'},
                { label : 'Name' , name : 'displayName' , type : EngineDocumentFieldType.default , width : '200px' }],
            formFields : [
                { label : 'ID'  , name : 'id' , type : EngineDocumentFieldType.default , readonly : true },
                { label : "Nom de l'entreprise" , name : 'companyName' , type : EngineDocumentFieldType.default },
                { label : "Description" , name : 'companyDescription' , type : EngineDocumentFieldType.textarea },
                { label : "Image" , name : 'image' , type : EngineDocumentFieldType.image },
            ]
        },
    ]
};
