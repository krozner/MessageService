"use strict";

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { TemplateSignature, MessageType } from "../index";

@Entity({name: "Template", synchronize: false})
export class Template {

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @OneToOne(type => MessageType, type => type.Id, {eager: true})
    @JoinColumn({name: "TypeId"})
    Type: MessageType;

    @Column({nullable: false})
    Description: string;

    @Column({nullable: false})
    Content: string;

    @OneToOne(type => TemplateSignature, {eager: true})
    @JoinColumn({name: "SignatureId", referencedColumnName: "Id"})
    Signature?: TemplateSignature;

    toString(): string {
        const signature = this.Signature ? this.Signature.Content : "";
        return `${this.Content} ${signature}`.trim();
    }
}