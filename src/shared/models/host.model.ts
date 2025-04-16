import {IdModel} from "./id.model";


/**
 * HostModel
 */
export class HostModel extends IdModel {
    description: string = "";
    url : string = "";
    key: string = "";
    AiSystemInstruction : string = "";
    AiIKeywords : string = "";
    organizationId : string = "";
    refreshPost : boolean = false ;
    refreshCategories : boolean = false ;
    search : string = "";
    searchInProgress : boolean = false ;

    customHttp : string = "";
    customMenuName : string = "Personnalisé";
    debugCustomHttp : boolean = true ;

    /**
     * Constructor
     * @param {any} raw
     * @param {string} defaultId
     */
    constructor(raw: any = {}, defaultId = "") {
        super();
        this.init(raw, defaultId);
    }

}


