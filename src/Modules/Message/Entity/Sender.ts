"use strict";

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { ITransceiver } from "..";

@Entity({name: "MessageSender", synchronize: false})
export class Sender implements ITransceiver {

    @Exclude()
    private PayloadObject: object;

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @Column({nullable: false})
    Description: string;

    @Exclude()
    @Column({name: "Payload", nullable: false})
    private SerializedPayload: string;

    @CreateDateColumn({ precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    CreatedAt: Date;

    set Payload(data: object) {
        this.SerializedPayload = JSON.stringify(data);
    }

    @Expose({name: "Payload"})
    public getPayload(): object {
        if (!this.PayloadObject && this.SerializedPayload) {
            this.PayloadObject = JSON.parse(this.SerializedPayload);
        }
        return this.PayloadObject;
    }
}
