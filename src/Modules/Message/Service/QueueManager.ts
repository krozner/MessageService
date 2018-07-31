"use strict";

import { Service } from "typedi";
import { Exclude, Expose } from "class-transformer";
import { BaseManager } from "../../../Components";
import { DatabaseError } from "../../../Utils/Exception";
import { ITemplateSnippet } from "../../Template";
import { MessageRepository, QueuedMessage, ActionType, MessageQueueFactory, SendMessageParametersProvider } from "..";

@Exclude()
class MessageQueueResponse {

    public constructor(private message: QueuedMessage) {
    }

    @Expose()
    get UUID() {
        return this.message.UUID;
    }

    @Expose()
    get Status() {
        return this.message.Status;
    }
}

export interface IMessageQueueStorage {
    type: ActionType;
    provider: SendMessageParametersProvider;
}

@Service()
export class QueueManager extends BaseManager {

    async storeMessage(data: IMessageQueueStorage[]): Promise<MessageQueueResponse[]> {
        const factories = [];
        for(let storage of data) {
            const { type, provider } = storage;
            factories.push(await this.createStoreFactory(type, provider));
        }
        return await this.saveStorage(factories);
    }

    private async saveStorage(factories: MessageQueueFactory[]): Promise<MessageQueueResponse[]> {
        const response: MessageQueueResponse[] = [];
        try {
            await this.transaction(async (entityManager) => {
                for(let factory of factories) {
                    for(let entity of factory.create()) {
                        await entityManager.save(entity);
                        response.push(new MessageQueueResponse(entity));
                    }
                }
            });
            return response;
        } catch (e) {
            throw new DatabaseError("An error has occurred", e);
        }
    }

    private async createStoreFactory(
        type: ActionType, provider: SendMessageParametersProvider
    ): Promise<MessageQueueFactory>  {

        const constants: ITemplateSnippet[] = [];
        const messages = await this.repository.findByType(type);
        const { recipients, tags, attachments } = provider;

        if (attachments) {
            messages.forEach(message => {
                message.Attachments = attachments;
            });
        }

        return new MessageQueueFactory(messages, recipients, tags, constants);
    }

    public get repository(): MessageRepository {
        return this.getCustomRepository(MessageRepository);
    }
}
