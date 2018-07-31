"use strict";

import { Service } from "typedi";
import { loop } from "../Utils/Array";

@Service()
export class Hydrator {

    /**
     * Extract values from an object
     */
    public extract(object: object) {
        throw new Error("Not yet implemented");
    }

    /**
     * Hydrate object with the provided data.
     */
    public hydrate(data: any, object: object): void {
        this.set(object, data);
    }

    private set(object: {[key: string]: any}, propertyName: any, value?: any) {
        if (typeof propertyName === "string" && propertyName !== "Id") {
            // if (object.hasOwnProperty(propertyName)) {}
            object[propertyName] = value;
        }
        if (typeof propertyName === "object") {
            loop(propertyName, (value: any, key: string) => {
                this.set(object, key, value);
            });
        }
    }

}
