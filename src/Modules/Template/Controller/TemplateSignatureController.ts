"use strict";

import { Authorized, JsonController, Get, Post, Put, Delete, Param, Body } from "routing-controllers";
import { CrudController } from "../../../Components";
import { TemplateSignatureManager, TemplateSignatureRepository } from "../../Template";

@JsonController()
export class TemplateSignatureController extends CrudController {

    /**
     * @swagger
     * /api/template-signature:
     *  post:
     *      summary: Create new template signature
     *      parameters:
     *          - { name: body, in: body, required: true, schema: { example: { Description: "", Content: "" } } }
     *      tags: [Template]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/template-signature")
    async create(@Body() body: any) {
        return await this.manager.create(body);
    }

    /**
     * @swagger
     * /api/template-signature:
     *  get:
     *      summary: Get all template signatures
     *      tags: [Template]
     *      responses: { 200: {} }
     */
    @Authorized()
    @Get("/api/template-signature")
    async signatures() {
        return await this.manager.repository.find();
    }

    /**
     * @swagger
     * /api/template-signature/{id}:
     *  get:
     *      summary: Get all template signatures
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [Template]
     *      responses: { 200: {} }
     */
    @Authorized()
    @Get("/api/template-signature/:id")
    async signature(@Param("id") id: number) {
        return await this.findModel(id);
    }

    /**
     * @swagger
     * /api/template-signature/{id}:
     *  put:
     *      summary: Update template signature
     *      parameters:
     *          - { name: id, in: path, required: true, schema: { example: { Description: "", Content: "" } } }
     *          - { name: body, in: body, required: true, schema: { example: { Description: "", Content: "" } } }
     *      tags: [ Template ]
     *      responses: { 200: {} }
     */
    @Authorized()
    @Put("/api/template-signature/:id")
    async update(@Param("id") id: number, @Body() body: any) {
        return await this.manager.update(await this.findModel(id), body);
    }

    /**
     * @swagger
     * /api/template-signature/{id}:
     *  delete:
     *      summary: Delete template signature
     *      parameters:
     *          - { name: id, in: path, required: true }
     *      tags: [ Template ]
     *      responses: { 200: {} }
     */
    @Authorized()
    @Delete("/api/template-signature/:id")
    async destroy(@Param("id") id: number) {
        return await this.manager.destroy(await this.findModel(id));
    }

    protected get manager(): TemplateSignatureManager {
        return this.get(TemplateSignatureManager);
    }

}
