"use strict";

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated, OneToOne, JoinColumn } from "typeorm";
import { IAttachmentsPayload, Message } from "..";

@Entity({name: "MessageQueue", synchronize: false})
export class QueuedMessage {

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @Column({type: "uuid"})
    @Generated("uuid")
    readonly UUID: string;

    @OneToOne(type => Message, message => message.Id, {eager: false})
    @JoinColumn({name: "MessageId"})
    Message: Message;

    @Column()
    Payload: string;

    @Column()
    Status: number;

    @Column()
    Log: string;

    @CreateDateColumn({precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    CreatedAt: Date;

    @CreateDateColumn({precision: null, type: "timestamp", default: null})
    UpdatedAt?: Date;

    @CreateDateColumn({precision: null, type: "timestamp", default: null})
    SentAt?: Date;

    get SentDelay() {
        const {CreatedAt, SentAt} = this;
        if (CreatedAt && SentAt) {
            return 0;
        }
        return null;
    }
}

export interface IMessagePayload {
    Recipient: any,
    Sender: any,
    Message: {
        Subject: string,
        Content: string,
        Attachments: IAttachmentsPayload[]
    }
}

export enum QueuedMessageStatus {
    Stored = 1,
    Processing = 2,
    Sent = 3,
    SentError = 4,
    QueueError = 5,
}
