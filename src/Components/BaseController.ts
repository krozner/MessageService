"use strict";

import { NotFoundError } from "routing-controllers";
import { ServiceAccessors } from "./ServiceAccessors";
import { Server } from "../Server";
import { BaseManager } from "./BaseManager";

export abstract class BaseController extends ServiceAccessors {

    protected get env() {
        return Server.instance.expressApp.get("env");
    }

    protected get express() {
        return Server.instance.expressApp;
    }

    protected createNotFoundException(message?: string) {
        return new NotFoundError(message ? message : "Not found");
    }
}
