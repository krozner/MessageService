"use strict";

import { EntityRepository, Repository } from "typeorm";
import { Action } from "..";

@EntityRepository(Action)
export class MessageActionRepository extends Repository<Action> {

}

