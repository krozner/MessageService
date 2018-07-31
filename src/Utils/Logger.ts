"use strict";

import { getRepository } from "typeorm";
import { ApplicationLog } from "../Modules/Common/Entity/ApplicationLog";

export class Logger {

    static TYPE_INFO = 1;
    static TYPE_ERROR = 2;

    private static createLog(description: string, data: object, type: number) {

        const log = new ApplicationLog();
        log.Description = description;
        log.Type = type;
        log.Content = JSON.stringify(data);

        getRepository(ApplicationLog)
            .save(log)
            .then(() => {})
            .catch(() => {});
    }

    static info(description: string, data: object): void {
        this.createLog(description, data, Logger.TYPE_INFO);
    }

    static error(description: string, data: object): void {
        this.createLog(description, data, Logger.TYPE_ERROR);
    }
}
