"use strict";

import { JsonController, Get, Authorized, QueryParam, Param } from "routing-controllers";
import { CrudController } from "../../../Components/CrudController";
import { MessageQueueRepository } from "../Repository/MessageQueueRepository";
import { QueuedMessageFacade } from "../Model/QueuedMessageFacade";

@JsonController()
export class QueueController extends CrudController {

    /**
     * @swagger
     * /api/message-queue:
     *  get:
     *      summary: Get message queue
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message-queue")
    async storage(@QueryParam("page") skip = 1, @QueryParam("limit") take = 10) {
        const queue = await this.getCustomRepository(MessageQueueRepository)
            .find({take, skip: (skip * take - take)});

        return queue.map((entity) => {
            return new QueuedMessageFacade(entity);
        });
    }

    /**
     * @swagger
     * /api/message-queue/{uuid}:
     *  get:
     *      summary: Get message status
     *      parameters:
     *          - {name: uuid, in: path, required: true}
     *      tags: [ Message ]
     *      responses: { 200: { } }
     */
    @Authorized()
    @Get("/api/message-queue/:uuid")
    async messageStatus(@Param("uuid") UUID: string) {
        const entity = await this.getCustomRepository(MessageQueueRepository)
            .findOne({
                where: { UUID }
            });
        if (! entity) {
            throw this.createNotFoundException("Message not found");
        }

        return new QueuedMessageFacade(entity);
    }

    protected get manager(): any {
        throw new Error("QueueController has no manager");
    }
}
