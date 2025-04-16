import {IdModel} from "./id.model";



/**
 * CustomDataModel
 */
export class CustomDataModel extends IdModel {
    name: string = "";
    type : string = "";
    value : string = "";
    section : string = "";
    wpId : string = "";
    hostId : string = "";


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


