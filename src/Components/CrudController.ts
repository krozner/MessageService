"use strict";

import { BaseController, BaseManager } from ".";

export abstract class CrudController extends BaseController {

    protected abstract manager: BaseManager;

    protected async findModel(id: number) {
        if (! id) {
            throw new Error("Invalid model id parameter");
        }
        const model = await this.manager.repository.findOne(id);
        if (! model) {
            throw this.createNotFoundException("Template not found");
        }
        return model;
    }
}
