import {EngineDocumentFieldType, IEngineSettings} from "../shared/interfaces/engine-settings.interface";


export const engineSettings : IEngineSettings = {
    adminRoleName : 'admin',
    menus: [
                { label: 'Mise en relation' ,  collectionName : 'suggests'},
                { label: 'Utilisateurs', collectionName: 'users'}
    ],

    collections : [
        { name : 'suggests' ,
          fieldOrderAsc : 'updatedAt',
          gridFields : [
              { name : 'message' , type : EngineDocumentFieldType.default  , width : '100%'},
              { name : 'note' , type : EngineDocumentFieldType.default , width : '20px' } ],
            formFields : [
                { name : 'message' , type : EngineDocumentFieldType.default },
                { name : 'note' , type : EngineDocumentFieldType.default },
            ]
        },
    ]
};
