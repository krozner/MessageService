"use strict";

import { JsonController, Authorized, Get, Post, Body } from "routing-controllers";
import { BaseController } from "../../../Components";
import { MessageActionManager, MessageRepository } from "..";
import { RuntimeError } from "../../../Utils/Exception";

@JsonController()
export class MessageActionController extends BaseController {

    /**
     * @swagger
     * /api/message-action:
     *  get:
     *      summary: Get available message actions
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message-action")
    actions() {
        return this.manager.repository.find();
    }

    /**
     * @swagger
     * /api/message-action-bind:
     *  post:
     *      summary: Bind message with action
     *      parameters:
     *          - { name: body, in: body, required: true, schema: { example: {
     *              Action: 1, Message: 1
     *          } } }
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Post("/api/message-action-bind")
    async bind(@Body() body: {Action: number, Message: number}) {
        const action = await this.manager.repository
            .findOne(body.Action);
        if (!action) {
            throw new RuntimeError("Invalid request parameters. Action not found");
        }
        const message = await this.getCustomRepository(MessageRepository)
            .findOne(body.Message);
        if (!message) {
            throw new RuntimeError("Invalid request parameters. Message not found");
        }

        return this.manager.bind(message, [action]);
    }

    private get manager(): MessageActionManager {
        return this.get(MessageActionManager);
    }
}
