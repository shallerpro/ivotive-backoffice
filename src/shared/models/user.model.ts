import {IdModel} from "./id.model";


enum UserRole {
    admin = "admin",
    user = "",
}

/**
 * UserModel
 */
class UserModel extends IdModel {
    email = "";
    enabled = false ;
    name = "";
    role = UserRole.user;

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
    UserModel,
    UserRole
};
