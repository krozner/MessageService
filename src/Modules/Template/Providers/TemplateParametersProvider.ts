"use strict";

export class TemplateParametersProvider {

    Type: number;
    Signature: number;
    Description: string;
    Content: string;

    public constructor(private parameters: any) {
        Object.assign(this, parameters);
    }
}
