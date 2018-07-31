"use strict";

import { Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { Sender, ISenderParametersProvider } from "..";
import { BaseManager } from "../../../Components";

@Service()
export class SenderManager extends BaseManager {

    async create(provider: ISenderParametersProvider) {
        const sender = new Sender();
        this.hydrate(sender, provider);

        await this.repository.save(sender);
        return sender;
    }

    async update(sender: Sender, provider: ISenderParametersProvider) {
        this.hydrate(sender, provider);
        await this.repository.update(sender.Id, sender);
        return sender;
    }

    async destroy(sender: Sender) {
        await this.repository.delete(sender.Id);
        return {};
    }

    public get repository(): Repository<Sender> {
        return getRepository(Sender);
    }

    protected hydrate(sender: Sender, provider: ISenderParametersProvider) {
        const { Description, Transceiver } = provider;
        sender.Description = Description;
        sender.Payload = Transceiver.getPayload();
    }
}
