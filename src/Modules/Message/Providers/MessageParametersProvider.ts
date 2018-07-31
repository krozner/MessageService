"use strict";

import { Action, Sender } from "..";
import { Template } from "../../Template";

export interface IMessageParametersProvider {
    Description: string;
    Subject: string;
    Sender: Sender;
    Template: Template;
    Actions?: Action[];
}
