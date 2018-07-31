"use strict";

export interface ITransceiver {
    getPayload(): object;
}

export abstract class Transceiver implements ITransceiver {
    public abstract getName(): string | null;
    public abstract getContact(): object;

    public getPayload(): object {
        return {
            Name: this.getName(),
            ...this.getContact()
        };
    }
}
