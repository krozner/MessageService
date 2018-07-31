"use strict";

import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({name: "MessageType", synchronize: false})
export class MessageType {

    static readonly EmailMessage = 1;
    static readonly IntercomChatMessage = 2;

    @PrimaryColumn()
    readonly Id: number;

    @Column({nullable: false})
    Description: string;
}