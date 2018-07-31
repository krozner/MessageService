"use strict";

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Template } from "../../Template";
import { Action, AttachmentFiles, Sender } from "..";

@Entity({name: "Message", synchronize: false})
export class Message {

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @Column({nullable: false})
    Description: string;

    @Column({nullable: false})
    Subject: string;

    @OneToOne(type => Template, template => template.Id, {eager: true})
    @JoinColumn({name: "TemplateId"})
    Template: Template;

    @OneToOne(type => Sender, sender => sender.Id, {eager: true})
    @JoinColumn({name: "SenderId"})
    Sender: Sender;

    Actions?: Action[] | null = null;

    @CreateDateColumn({precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    CreatedAt: Date;

    Attachments?: AttachmentFiles;
}
