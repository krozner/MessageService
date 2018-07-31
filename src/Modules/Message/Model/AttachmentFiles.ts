"use strict";

export interface IAttachmentsParameters {
    Path?: string;
    File?: string;
    Name?: string;
}

export interface IAttachmentsPayload {
    path?: string;
    filename?: string,
    content?: string,
    encoding?: string
}

export class AttachmentFiles {

    private readonly base64Paths: string[];
    private readonly base64Files: {File: string, Name: string}[];

    constructor(private parameters: IAttachmentsParameters[]) {

        this.base64Paths = [];
        this.base64Files = [];

        parameters.forEach((data: any) => {
            if (data.Path) {
                this.base64Paths.push(data.Path);
            }
            if (data.File) {
                if (!data.Name) {
                    throw new Error("Attachment name is required");
                }
                this.base64Files.push(data);
            }
        });
    }

    static encodePaths(paths: string[]): AttachmentFiles {
        const encoded: IAttachmentsParameters[] = [];
        paths.forEach(filePath => {
            encoded.push({
                Path: Buffer.from(filePath).toString("base64")
            });
        });
        return new AttachmentFiles(encoded);
    }

    getBase64Paths() {
        return this.base64Paths;
    }

    getBase64Files() {
        return this.base64Files;
    }

    getPayload(): IAttachmentsPayload[] {
        if (this.base64Paths.length) {
            const filePaths: any = [];
            this.base64Paths.forEach(base64string => {
                filePaths.push({
                    path: Buffer.from(base64string, "base64").toString("ascii")
                });
            });
            return filePaths;
        }
        if (this.base64Files.length) {
            const files: IAttachmentsPayload[] = [];
            this.base64Files.forEach(data => {
                files.push({
                    filename: data.Name,
                    content: data.File,
                    encoding: "base64"
                });
            });
            return files;

        }
        return []
    }
}
