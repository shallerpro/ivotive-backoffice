import {IdModel} from "./id.model";


/**
 * CdSectionModel
 */
class CdSectionModel extends IdModel {

    name: string = "";

    constructor(raw: any = {}, defaultId = "" ,  ) {
        super();
        this.init(raw, defaultId);
    }


}


export {
    CdSectionModel
};
