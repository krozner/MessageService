"use strict";

import { Service } from "typedi";
import { BaseManager } from "../../../Components";
import { MessageRepository, Message, IMessageParametersProvider } from "..";
import { MessageActionManager } from "./MessageActionManager";
import { RuntimeError } from "../../../Utils/Exception";

@Service()
export class MessageManager extends BaseManager {

    async create(provider: IMessageParametersProvider) {
        let message = new Message();
        this.hydrate(provider, message);

        await this.repository.save(message);
        await this.bindAction(message, provider);

        return message;
    }

    async update(message: Message, provider: IMessageParametersProvider) {
        this.hydrate(provider, message);

        await this.bindAction(message, provider);
        await this.repository.update(message.Id, message);

        return message;
    }

    // todo transaction
    private async bindAction(message: Message, provider: IMessageParametersProvider) {
        const { Actions } = provider;
        if (Actions && Actions.length) {

            const actionManager = this.get(MessageActionManager);
            const _actions = await actionManager.repository.findByIds(Actions);

            if (_actions.length !== Actions.length) {
                throw new RuntimeError("Invalid 'Actions' parameter. Message action not found");
            }

            await actionManager.bind(message, _actions);
        }
    }

    async destroy(message: Message) {
        await this.repository.delete(message.Id);
        return {};
    }

    public get repository(): MessageRepository {
        return this.getCustomRepository(MessageRepository);
    }
}
