/**
 * Ignore JSON Pattern
 */
enum ToJSONPattern {
    // On ignore tous sauf
    ignore,
    // On prends seulement
    only
}


/**
 * DefaultModel
 */
class DefaultModel {

    public raw? : any ;

    /**
     * Constructor
     * @param {any} raw
     * @param {string} defaultId
     */
    constructor(raw: any = {}) {
        this.init(raw);
        this.raw = raw;
    }


    /**
     * fromJSON
     * @param  {any} raw
     */
    fromJSON(raw: any = {}) {
        const properties: any = this.getProperties();

        for (let i = 0; i < properties.length; i++) {
            this.setProperty(properties[i], raw);
        }
    }

    /**
     * Constructor
     * @param {any} raw
     * @param {string} defaultId
     */
    init(raw: any = {}) {
        this.fromJSON(raw);
    }

    /**
     * toJSON
     * @param {string[]} patternProperties
     * @param { ToJSONPattern } pattern
     * @return {any}
     */
    toJSON(patternProperties: string[] = [],
           pattern: ToJSONPattern = ToJSONPattern.ignore) {
        const properties: any = this.getProperties();
        const result: any = {};

        /**
         * isIgnore
         * @param {string} field
         * @return {any}
         */
        function inPattern(field: string) {
            for (let j = 0; j < patternProperties.length; j++) {
                if (patternProperties[j] === field) {
                    return true;
                }
            }
            return false;
        }


        // On supprime tous sauf
        for (let i = 0; i < properties.length; i++) {
            const name = properties[i];

            if ( name == 'raw') continue;

            switch (pattern) {
                case ToJSONPattern.only:
                    if (!inPattern(name)) continue;
                    break;


                default:
                    if (inPattern(name)) continue;

                    break;
            }

            const value = this.readProperty(name, this);
            result [name] = value;
        }

        return result;
        // return JSON.parse( JSON.stringify( result ) );
    }

    /**
     * getProperties
     * @return {any}
     */
    getProperties() {


        const ret = Object
            .getOwnPropertyNames(this)
            .filter((name) => name !== "_raw");

        return ret;
    }

    /**
     * readProperty
     * @param { string } name
     * @param { any } obj
     * @param { any } defaultValue
     * @return { any }
     */
    readProperty(name: string, obj: any = this,
                 defaultValue: any = null): any {
        let fieldValue = obj[name];

        if (fieldValue === null) fieldValue = defaultValue;
        return fieldValue;
    }

    /**
     * setProperty
     * @param { string } name
     * @param { any } value
     */
    setProperty(name: string, value: any = null) {
        const self: any = this;

        if (value [name] !== undefined) {
            self[name] = value [name];
        }
    }
}

export {DefaultModel, ToJSONPattern};
