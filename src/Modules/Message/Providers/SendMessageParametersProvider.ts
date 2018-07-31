"use strict";

import { isArray } from "util";
import { IAttachmentsParameters, AttachmentFiles, Transceiver } from "../";
import { TemplateSnippet } from "../../Template";

export interface ISendMessageParameters {
    Recipients: any[];
    Tags: [{ Name: string, Value: string }];
    Attachments?: IAttachmentsParameters[];
}

export abstract class SendMessageParametersProvider {

    private _tags: TemplateSnippet[] = [];
    private _attachments: AttachmentFiles | null = null;

    protected constructor(protected parameters: ISendMessageParameters) {
        const { Tags, Attachments } = this.parameters;
        if (isArray(Tags)) {
            Tags.forEach(tag => {
                this._tags.push(new TemplateSnippet(tag.Name, tag.Value));
            });
        }

        if (Attachments) {
            this._attachments = new AttachmentFiles(Attachments);
        }
    }

    public abstract recipients: Transceiver[];

    get tags(): TemplateSnippet[] {
        return this._tags;
    }

    get attachments(): AttachmentFiles | null {
        return this._attachments;
    }

}
