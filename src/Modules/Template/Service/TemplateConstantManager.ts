"use strict";

import { Service } from "typedi";
import { BaseManager } from "../../../Components/BaseManager";
import { TemplateConstant, ITemplateConstantProperties, TemplateConstantRepository } from "..";
import { RuntimeError } from "../../../Utils/Exception";
import { Message } from "../../Message";

@Service()
export class TemplateConstantManager extends BaseManager {

    public async create(data: ITemplateConstantProperties): Promise<TemplateConstant> {

        await this.validate(data);
        if (await this.repository.findByName(data.Name)) {
            new RuntimeError(`Invalid template constant parameters. Constant '${data.Name}' already exists.`);
        }

        const constant = new TemplateConstant();
        this.hydrate(data, constant);

        await this.repository.save(constant);
        return constant;
    }

    public async update(constant: TemplateConstant, data: any) {

        await this.validate(data);
        this.hydrate(data, constant);

        const copy = await this.repository.findByName(data.Name);
        if (copy && copy.Id !== constant.Id) {
            throw new RuntimeError(`Invalid template constant parameters. Constant '${data.Name}' already exists.`);
        }

        await this.repository.update(constant.Id, constant);
        return constant;
    }

    async destroy(constant: TemplateConstant) {
        await this.repository.delete(constant.Id);
        return {
            message: ""
        };
    }

    private async validate(data: ITemplateConstantProperties) {
        if (!data.Name && !data.Value) {
            throw new RuntimeError("Invalid template constant parameters. 'Name' and 'Value' are required.");
        }
        if (!data.Name.match(/^[a-z0-9]+$/i)) {
            throw new RuntimeError("Invalid template constant parameters. Constant name must be alphanumeric.");
        }
    }

    public get repository(): TemplateConstantRepository {
        return this.getCustomRepository(TemplateConstantRepository);
    }

}
