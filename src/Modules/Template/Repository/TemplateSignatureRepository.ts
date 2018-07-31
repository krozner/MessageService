"use strict";

import { EntityRepository, Repository } from "typeorm";
import { TemplateSignature } from "..";

@EntityRepository(TemplateSignature)
export class TemplateSignatureRepository extends Repository<TemplateSignature> {

}

