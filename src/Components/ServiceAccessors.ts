"use strict";

import { Container, ObjectType } from "typedi";
import { Repository, getCustomRepository, getRepository } from "typeorm";

export abstract class ServiceAccessors {

    protected get<T>(type: ObjectType<T>): T {
        return Container.get(type);
    }

    protected getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
        return getRepository(entity);
    }

    protected getCustomRepository<T>(repository: ObjectType<T>): T {
        return getCustomRepository(repository);
    }

}
