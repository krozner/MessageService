"use strict";

import { JsonController, Authorized, Get, Post, Put, Delete, Body, Param } from "routing-controllers";
import { CrudController } from "../../../Components";
import { Message, MessageActionRepository, MessageManager, Sender } from "..";
import { Template } from "../../Template";
import { IEmailMessageParameters, EmailMessageParametersProvider } from "../../EmailMessage";
import { MessageActionManager } from "../Service/MessageActionManager";
import { RuntimeError } from "../../../Utils/Exception";
import { isArray } from "util";

// TODO refactor IEmailMessageParameters -> IMessageParameters
@JsonController()
export class MessageController extends CrudController {

    private async createDataProvider(body: IEmailMessageParameters) {

        const provider = new EmailMessageParametersProvider(body);
        provider
            .setTemplate(<Template> await this.getRepository(Template).findOne(body.Template))
            .setSender(<Sender> await this.getRepository(Sender).findOne(body.Sender));

        const { Actions } = body;
        if (Actions && Actions.length) {
            provider.setActions(
                await this.getCustomRepository(MessageActionRepository).findByIds(Actions)
            )
        }

        return provider;
    }

    /**
     * @swagger
     * /api/message:
     *  post:
     *      summary: Create new message
     *      parameters:
     *          - { name: body, in: body, required: true, schema: { example: {
     *              Description: "", Subject: "", Template: 1, Sender: 1, Actions: null
     *          } } }
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/message")
    async create(@Body() body: IEmailMessageParameters) {
        return await this.manager.create(await this.createDataProvider(body));
    }

    /**
     * @swagger
     * /api/message:
     *  get:
     *      summary: Get messages
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message")
    messages() {
        return this.manager.repository.getAll();
    }

    /**
     * @swagger
     * /api/message/{id}:
     *  get:
     *      summary: Get message by id
     *      parameters:
     *          - {name: id, in: path, required: true}
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message/:id")
    async message(@Param("id") id: number) {
        return await this.manager.repository.getFullMessage(<Message> await this.findModel(id));
    }

    /**
     * @swagger
     * /api/message/{id}:
     *  put:
     *      summary: Update message
     *      parameters:
     *          - { name: id, in: path, required: true }
     *          - { name: body, in: body, required: true, schema: { example: {
     *              Description: "", Subject: "", Template: 1, Sender: 1, Action: null
     *          } } }
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Put("/api/message/:id")
    async update(@Param("id") id: number, @Body() body: IEmailMessageParameters) {
        return await this.manager.update(
            await this.findModel(id), await this.createDataProvider(body)
        );
    }

    /**
     * @swagger
     * /api/message/{id}:
     *  delete:
     *      summary: Delete message
     *      parameters:
     *          - { name: id, in: path, required: true }
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Delete("/api/message/:id")
    async destroy(@Param("id") id: number) {
        return await this.manager.destroy(await this.findModel(id));
    }

    protected get manager(): MessageManager {
        return this.get(MessageManager);
    }

}
