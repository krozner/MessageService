"use strict";

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export interface ITemplateSignature {
    Description: string;
    Content: string;
}

@Entity({name: "TemplateSignature", synchronize: false})
export class TemplateSignature implements ITemplateSignature {

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @Column({nullable: false})
    Description: string;

    @Column({nullable: false})
    Content: string;

}