"use strict";

import { Service } from "typedi";
import { RuntimeError } from "../../../Utils/Exception";
import { AttachmentFiles } from "..";

interface IUploadedFile {
    name: string;
    mv: Function;
}

@Service()
export class AttachmentManager {

    public async saveUploadFiles(files: IUploadedFile): Promise<AttachmentFiles|any> {
        return new Promise((resolve, reject) => {
            const error = (err?: Error) => {
                if (err) {
                    reject(new RuntimeError("Error during file upload", err));
                }
            };
            const crypto = require("crypto");
            const fs = require("fs");
            const dir = `${process.env.APP_PATH}/src/Resources/Attachments`;

            const results: string[] = [];
            require("async").each(files, (file: any) => {

                const targetDir = `${dir}/${crypto.randomBytes(8).toString("hex")}`;

                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir);
                }

                const filePath = `${targetDir}/${file.name}`;
                file.mv(filePath, error);

                results.push(filePath);
            }, error);

            resolve(AttachmentFiles.encodePaths(results));
        });
    }
}
