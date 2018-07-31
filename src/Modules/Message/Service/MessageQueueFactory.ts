"use strict";

import { Message, IMessagePayload, Transceiver, QueuedMessage, QueuedMessageStatus } from "..";
import { ITemplateSnippet } from "../../Template";

export class MessageQueueFactory {

    public constructor(
        private messages: Message[],
        private recipients: Transceiver[],
        private tags: ITemplateSnippet[],
        private constants: ITemplateSnippet[]
    ) {
    }

    public create(): QueuedMessage[] {
        const storage: QueuedMessage[] = [];

        const replaceSnippets = (text: string) => {
            this.tags.forEach((tag) => {
                text = text.replace(new RegExp(`{Tags\.${tag.Name}}`, "g"), tag.Value);
            });
            this.constants.forEach((constant) => {
                text = text.replace(new RegExp(`{Constants\.${constant.Name}}`, "g"), constant.Value);
            });
            return text;
        };

        this.messages.forEach((message: Message) => {
            this.recipients.forEach((Recipient: Transceiver) => {

                const {Template, Subject, Sender, Attachments} = message;

                const payload = <IMessagePayload> {
                    Recipient: Recipient.getPayload(),
                    Sender: Sender.getPayload(),
                    Message: {
                        Subject: replaceSnippets(Subject),
                        Content: replaceSnippets(Template.toString()),
                        Attachments: Attachments ? Attachments.getPayload() : null
                    }
                };

                const item = new QueuedMessage();
                item.Status = QueuedMessageStatus.Stored;
                item.Payload = JSON.stringify(payload);
                item.Message = message;

                // if (item.Payload.match(/\{Constants|Tags\.(.+)\}/)) {
                //     item.Status = QueuedMessageStatus.QueueError;
                //     item.UpdatedAt = new Date();
                //     item.Log = JSON.stringify({error: {
                //         message: "Message content contains unsupported tags or constants"
                //     }});
                // }

                storage.push(item);
            });
        });

        return storage;
    }


}
