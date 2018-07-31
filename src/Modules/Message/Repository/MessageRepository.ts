"use strict";

import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Action, ActionType, Message, MessageActionRepository } from "..";

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {

    async findByType(type: ActionType): Promise<Message[]> {
        const results = await this.query(`SELECT "MessageId" FROM "MessageAction" WHERE "ActionId" = $1`, [ type ]);
        const messages = results.map((data: {MessageId: number}) => { return data.MessageId; });

        return this.find({
            where: `"Message"."Id" IN (${[0, ...messages]})`
        });
    }

    async getFullMessage(message: Message) {

        let actions = await this.query(`SELECT "ActionId" FROM "MessageAction" WHERE "MessageId" = ${message.Id}`)
        actions = actions.map((data: {ActionId: number}) => {
                return data.ActionId;
            });

        const repository = getCustomRepository(MessageActionRepository);

        message.Actions = <Action[]> await repository.find({
            where: `"Action"."Id" IN (${[0, ...actions].join(",")})`
        });

        return message;
    }

    async getAll() {
        const results: Message[] = [];
        for(let message of await this.find()) {
            results.push(await this.getFullMessage(message));
        }
        return results;
    }
}

