import {DefaultModel} from "../default.model";

export class CustomFunctionRouting extends DefaultModel {
    name = "";
    routing = "";

    constructor(raw: any = {}) {
        super();
        this.init(raw);
    }

}
