"use strict";

import { ExpressMiddlewareInterface } from "routing-controllers";
import { BasicAuth } from "./BasicAuth";

export class BasicAuthMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any): any {
        BasicAuth(request, response, next);
    }
}
