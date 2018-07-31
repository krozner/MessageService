"use strict";

import { Authorized, JsonController, Get, Post, Put, Delete, Param, Body } from "routing-controllers";
import { CrudController } from "../../../Components";
import { TemplateConstantManager } from "../Service/TemplateConstantManager";

@JsonController()
export class TemplateConstantController extends CrudController {

    /**
     * @swagger
     * /api/template-constant:
     *  post:
     *      summary: Create new template constant
     *      parameters:
     *          - {name: body, in: body, required: true, schema: {example: {Name: "", Value: ""}}}
     *      tags: [Template]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/template-constant")
    create(@Body() body: any) {
        return this.manager.create(body);
    }

    /**
     * @swagger
     * /api/template-constant:
     *  get:
     *      summary: Get all template constants
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/template-constant")
    templates() {
        return this.manager.repository.find();
    }

    /**
     * @swagger
     * /api/template-constant/{id}:
     *  put:
     *      summary: Update template constant
     *      parameters:
     *          - {name: id, in: path, required: true}
     *          - {name: body, in: body, required: true, schema: {example: {Name: "", Value: ""}}}
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Put("/api/template-constant/:id")
    async update(@Param("id") id: number, @Body() body: any) {
        return await this.manager.update(await this.findModel(id), body);
    }

    /**
     * @swagger
     * /api/template-constant/{id}:
     *  delete:
     *      summary: Delete template constant
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [ Template ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Delete("/api/template-constant/:id")
    async destroy(@Param("id") id: number) {
        return await this.manager.destroy(await this.findModel(id));
    }

    protected get manager(): TemplateConstantManager {
        return this.get(TemplateConstantManager);
    }

}
