"use strict";

import { Service } from "typedi";
import { BaseManager } from "../../../Components/BaseManager";
import { Template, TemplateRepository, TemplateSignatureRepository } from "..";
import { TemplateParametersProvider } from "../Providers/TemplateParametersProvider";
import { RuntimeError } from "../../../Utils/Exception";

@Service()
export class TemplateManager extends BaseManager {

    private async hydrateTemplate(provider: TemplateParametersProvider, template: Template) {
        this.hydrate({
            Content: provider.Content,
            Description: provider.Description,
            Signature: await this.getCustomRepository(TemplateSignatureRepository).findOne(provider.Signature),
            Type: await this.repository.findType(provider.Type),
        }, template);

        if (! template.Type) {
            throw new RuntimeError("Invalid template type");
        }
    }

    public async create(provider: TemplateParametersProvider) {
        const template = new Template();
        await this.hydrateTemplate(provider, template);
        return this.repository.save(template);
    }

    public async update(template: Template, provider: TemplateParametersProvider) {
        await this.hydrateTemplate(provider, template);
        await this.repository.update(template.Id, template);
        return template;
    }

    public async destroy(template: Template) {
        return this.repository.delete(template.Id);
    }

    public get repository(): TemplateRepository {
        return this.getCustomRepository(TemplateRepository);
    }
}
