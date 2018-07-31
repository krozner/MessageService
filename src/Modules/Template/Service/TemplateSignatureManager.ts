"use strict";

import { Service } from "typedi";
import { BaseManager } from "../../../Components/BaseManager";
import { ITemplateSignature, TemplateSignature, TemplateSignatureRepository } from "..";

@Service()
export class TemplateSignatureManager extends BaseManager {

    public async create(data: ITemplateSignature) {

        this.validate(data);

        const signature = new TemplateSignature();
        this.hydrate(data, signature);

        return await this.repository.save(signature);
    }

    public async update(signature: TemplateSignature, data: ITemplateSignature) {

        this.validate(data);
        this.hydrate(data, signature);

        await this.repository.update(signature.Id, signature);

        return signature;
    }

    public async destroy(signature: TemplateSignature) {
        await this.repository.delete(signature.Id);
        return {
            success: true
        };
    }

    private validate(data: ITemplateSignature) {
        if (!data.Content || !data.Description) {
            throw new Error("Invalid signature data");
        }
    }

    public get repository(): TemplateSignatureRepository {
        return this.getCustomRepository(TemplateSignatureRepository);
    }
}
