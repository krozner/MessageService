"use strict";

import { Service } from "typedi";
import { BaseManager } from "../../../Components";
import { Message, MessageActionRepository, Action } from "..";

@Service()
export class MessageActionManager extends BaseManager {

    async bind(message: Message, actions: Action[]) {

        await this.repository.query(`
            DELETE FROM "MessageAction" WHERE "MessageId" = ${message.Id}
        `);

        for(let action of actions) {
            await this.repository.query(`
                INSERT INTO "MessageAction" ("ActionId", "MessageId") VALUES (${action.Id}, ${message.Id})
            `);
        }

        return {
            success: true
        };
    }

    public get repository(): MessageActionRepository {
        return this.getCustomRepository(MessageActionRepository);
    }
}
