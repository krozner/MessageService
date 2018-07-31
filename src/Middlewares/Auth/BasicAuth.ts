"use strict";

import { Request, Response } from "express";

export const BasicAuth = (req: Request, res: Response, next: any) => {
    const basicAuth = require("basic-auth");

    function unauthorized(res: Response) {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        return res.sendStatus(401);
    }

    const user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    const {BASIC_AUTH_USER, BASIC_AUTH_PASS} = process.env;

    if (user.name === BASIC_AUTH_USER && user.pass === BASIC_AUTH_PASS) {
        return next();
    } else {
        return unauthorized(res);
    }
};
