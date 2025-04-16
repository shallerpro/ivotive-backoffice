import {IdModel} from "./id.model";



/**
 * SearchResultModel
 */
export class SearchResultModel extends IdModel {
    hostId : string = "";
    content : string = "";
    title : string = "";
    needlePosition : number = 0;
    segmentLength : number = 0;
    segmentStart : number = 0 ;
    checksum : string = "" ;
    isPage : boolean = false;
    imageUrl : string = "";

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


