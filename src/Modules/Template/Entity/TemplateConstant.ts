"use strict";

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export interface ITemplateConstantProperties {
    Name: string;
    Value: string;
}

@Entity({name: "TemplateConstant", synchronize: false})
export class TemplateConstant {

    @PrimaryGeneratedColumn()
    readonly Id: number;

    @Column({nullable: false})
    Name: string;

    @Column()
    Value: string;
}