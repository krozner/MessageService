"use strict";

import { Authorized, JsonController, Get, Post, Put, Delete, Param, Body } from "routing-controllers";
import { CrudController } from "../../../Components";
import { TemplateManager } from "..";
import { TemplateParametersProvider } from "../Providers/TemplateParametersProvider";

@JsonController()
export class TemplateController extends CrudController {

    /**
     * @swagger
     * /api/template:
     *  post:
     *      summary: Create new template
     *      parameters:
     *          - {name: body, in: body, required: true, schema: {
     *              example: {Description: "", Content: "", Type: 1, Signature: 1}
     *          }}
     *      tags:
     *          - Template
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/template")
    async create(@Body() body: any) {
        return this.manager.create(new TemplateParametersProvider(body));
    }

    /**
     * @swagger
     * /api/template:
     *  get:
     *      summary: Get all templates
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/template")
    templates() {
        return this.manager.repository.find();
    }

    /**
     * @swagger
     * /api/template/{id}:
     *  get:
     *      summary: Get template data
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/template/:id")
    template(@Param("id") id: number) {
        return this.findModel(id);
    }

    /**
     * @swagger
     * /api/template/{id}:
     *  put:
     *      summary: Update template
     *      parameters:
     *          - {name: id, in: path, required: true}
     *          - {name: body, in: body, required: true, schema: {
     *              example: {Description: "", Content: "", Type: 1, Signature: 1}
     *          }}
     *      tags: [Template]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Put("/api/template/:id")
    async update(@Param("id") id: number, @Body() body: any) {
        return this.manager.update(await this.findModel(id), new TemplateParametersProvider(body));
    }

    /**
     * @swagger
     * /api/template/{id}:
     *  delete:
     *      summary: Delete template
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [Template]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Delete("/api/template/:id")
    async destroy(@Param("id") id: number) {
        return await this.manager.destroy(await this.findModel(id));
    }

    protected get manager(): TemplateManager {
        return this.get(TemplateManager);
    }

    /**
     * @swagger
     * /api/template-type:
     *  get:
     *      summary: Get all template types
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/template-type")
    templateTypes() {
        return this.manager.repository.getTypes();
    }
}
