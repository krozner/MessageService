"use strict";

import { QueuedMessage, IMessagePayload } from "..";

export class QueuedMessageFacade {

    public constructor(message: QueuedMessage) {

        const { UUID, Status, CreatedAt, UpdatedAt } = message;
        const Payload: IMessagePayload = JSON.parse(message.Payload);

        Object.assign(this, {
            UUID, Status, CreatedAt, UpdatedAt, Payload
        })
    }

}
