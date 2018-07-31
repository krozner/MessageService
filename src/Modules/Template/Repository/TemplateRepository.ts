"use strict";

import { EntityRepository, getRepository, Repository } from "typeorm";
import { Template, MessageType } from "..";

@EntityRepository(Template)
export class TemplateRepository extends Repository<Template> {

    findType(id: number) {
        return getRepository(MessageType).findOne(id);
    }

    getTypes() {
        return getRepository(MessageType).find();
    }
}

