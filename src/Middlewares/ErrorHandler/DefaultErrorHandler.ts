"use strict";

import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({type: "after"})
export class DefaultErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: any, res: any, next: any) {

        const { statusCode, httpCode, message } = error;
        const code = httpCode ? httpCode : (statusCode ? statusCode : 500);

        return res.status(code).send(error);

        // switch (error.name) {
        //     case "AuthorizationRequiredError":
        //         return res.status(code).send({
        //             code, error: "Access denied",
        //         });
        // }
        //
        // const response: {[key: string]: any} = {
        //     code, error: message
        // };
        //
        // const originalError = (_error: any, _response: any) => {
        //     const err = _error.originalError;
        //     if (err) {
        //         _response.originalError = {
        //             code: err.code,
        //             message: err.message
        //         };
        //         originalError(err, _response.originalError);
        //     }
        // };
        // originalError(error, response);
        //
        // res.status(code).send(response);
    }
}
