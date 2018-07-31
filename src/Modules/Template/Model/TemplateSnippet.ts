"use strict";

export interface ITemplateSnippet {
    Name: string;
    Value: string;
}

export class TemplateSnippet implements ITemplateSnippet {

    private properties: { Name: string, Value: string };

    constructor(Name: string, Value: string) {
        this.properties = {Name, Value};
    }

    get Name(): string {
        return this.properties.Name;
    }

    get Value(): string {
        return this.properties.Value;
    }
}
