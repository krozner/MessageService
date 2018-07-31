"use strict";

import { JsonController, Get, Authorized, Post, Body, Put, Param, Delete } from "routing-controllers";
import { CrudController } from "../../../Components";
import { MessageRepository, SenderManager } from "..";
import { EmailSenderParametersProvider } from "../../EmailMessage";

@JsonController()
export class SenderController extends CrudController {

    /**
     * @swagger
     * /api/message-sender:
     *  get:
     *      summary: Get message senders
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message-sender")
    senders() {
        return this.manager.repository.find({
            order: {Id: "ASC"}
        });
    }

    /**
     * @swagger
     * /api/message-sender:
     *  post:
     *      summary: Create new message sender
     *      parameters:
     *          - {name: body, in: body, required: true, schema: {
     *              example: {Description: "Test sender", Name: "John Doe", Email: "test@euvic.pl"}
     *          }}
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/message-sender")
    async create(@Body() body: any) {
        return await this.manager.create(new EmailSenderParametersProvider(body));
    }

    /**
     * @swagger
     * /api/message-sender/{id}:
     *  put:
     *      summary: Update message sender
     *      parameters:
     *          - {name: id, in: path, required: true}
     *          - {name: body, in: body, required: true, schema: {
     *              example: {Description: "Test sender", Name: "John Doe", Email: "test@euvic.pl"}
     *          }}
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Put("/api/message-sender/:id")
    async update(@Param("id") id: number, @Body() body: any) {
        const sender = await this.findModel(id);
        return await this.manager.update(sender, new EmailSenderParametersProvider(body));
    }

    /**
     * @swagger
     * /api/message-sender/{id}:
     *  delete:
     *      summary: Delete message sender
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Delete("/api/message-sender/:id")
    async destroy(@Param("id") id: number) {
        return await this.manager.destroy(await this.findModel(id));
    }

    protected get manager(): SenderManager {
        return this.get(SenderManager);
    }

}
