import {IdModel} from "./id.model";





/**
 * OrganizationModel
 */
class OrganizationModel extends IdModel {

    name: string = "";
    description: string = "";
    settings : any = {};
    url : string = "";
    users : any[] = [];


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


export {
    OrganizationModel
};
