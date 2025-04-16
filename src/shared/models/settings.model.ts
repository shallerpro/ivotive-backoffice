import {IdModel} from "./id.model";


/**
 * UserModel
 */
class SettingsModel extends IdModel {

    AiSystem = '';
    AiUser = '';

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
    SettingsModel
};
