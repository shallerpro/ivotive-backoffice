import {DefaultModel} from "./default.model";


/**
 * IdModel
 */
class IdModel extends DefaultModel {

    public id = "";


    constructor(raw: any = {}, defaultId = ""  ) {
        super(raw);
        this.init(raw, defaultId);
    }

    /**
     * Constructor
     * @param {any} raw
     * @param {string} defaultId
     */
    override init(raw: any = {}, defaultId = "") {
        if (defaultId !== "") this.id = defaultId;
        this.raw = raw ;
        this.fromJSON(raw);
    }


    /**
     * Nouveau modèle ?
     * @return {any}
     */
    get isNew() {
        return this.id === "";
    }





    /**
     * sanatizeId
     */
    static  sanatizeId ( idOrReference : any )  {

        // Id Normal ?
        if ( idOrReference.indexOf('/') === -1 ) {
            return idOrReference;
        } else {


        }

    }
}

export {IdModel};
