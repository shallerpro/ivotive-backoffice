import {DefaultModel} from "../default.model";


enum ExtensionCollectionHeaderType {
    'default' = 0,
    'image'= 1,
    'html' = 2
}

class ExtensionCollectionHeader extends DefaultModel {
    name = "";
    type : number = ExtensionCollectionHeaderType.default;
    field = "";

    constructor(raw: any = {}) {
        super();
        this.init(raw);
    }

}




export {
    ExtensionCollectionHeader,
    ExtensionCollectionHeaderType
}