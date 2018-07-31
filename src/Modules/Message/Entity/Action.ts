"use strict";

import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { MessageType } from "./MessageType";

@Entity({name: "Action", synchronize: false})
export class Action {

    @PrimaryColumn()
    readonly Id: number;

    @Column({nullable: false})
    Description: string;

    @OneToOne(type => MessageType, type => type.Id, {eager: true})
    @JoinColumn({name: "TypeId"})
    Type: MessageType;
}
