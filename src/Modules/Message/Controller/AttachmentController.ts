"use strict";

import { JsonController, Post, Authorized, Req } from "routing-controllers";
import { BaseController, Logger } from "../../../Components";
import { AttachmentManager } from "../Service/AttachmentManager";

@JsonController()
export class AttachmentController extends BaseController {

    /**
     * swagger
     * /api/message-attachments-upload:
     *  post:
     *      summary: Upload message attachments
     *      parameters:
     *          - {type: file, in: formData, required: true}
     *      tags: [ SendMessage ]
     *      responses: { 200: ["base64string"] }
     */
    @Authorized()
    @Post("/api/message-attachments-upload")
    async upload(@Req() req: any) {

        if (!req.files) {
            Logger.error("Message attachment upload error - no files were uploaded", {});
            throw new Error("No files were uploaded.");
        }

        const attachments = await this.get(AttachmentManager)
            .saveUploadFiles(req.files);

        return attachments.getBase64Paths();
    }

}
