import {DefaultModel} from "./default.model";
/**
 * ItemSelector
 */
class ItemSelector extends DefaultModel {
    name = "";
    data : any = {}
    /**
     * Constructor
     * @param {any} raw
     * @param {string} defaultId
     */
    constructor(raw: any = {}, defaultId = "") {
        super();
        this.init(raw);

    }


}


export {
    ItemSelector
};
