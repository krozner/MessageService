"use strict";

import { HttpError } from "routing-controllers";

export class DatabaseError extends HttpError {
    constructor(message: string, public originalError: Error) {
        super(500, message);
    }
}

export class RuntimeError extends HttpError {
    constructor(message: string, public originalError?: Error) {
        super(500, message);
    }
}
