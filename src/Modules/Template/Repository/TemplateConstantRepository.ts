"use strict";

import { EntityRepository, Repository } from "typeorm";
import { TemplateConstant } from "..";

@EntityRepository(TemplateConstant)
export class TemplateConstantRepository extends Repository<TemplateConstant> {

    findByName(name: string) {
        return this.findOne({
            where: `"TemplateConstant"."Name" = '${name}'`
        });
    }
}

