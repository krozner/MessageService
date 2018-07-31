"use strict";

import { EntityManager, EntityRepository, getConnection, Repository } from "typeorm";
import { QueuedMessage, QueuedMessageStatus } from "..";

@EntityRepository(QueuedMessage)
export class MessageQueueRepository extends Repository<QueuedMessage> {

    async getQueue() {
        return getConnection().transaction(async (entityManager: EntityManager) => {
            const processing = await this.find({
                where: {
                    Status: QueuedMessageStatus.Processing
                }
            });
            if (processing.length) {
                throw new Error("Message queue is processing. Cannot run another process until current is finished");
            }

            const queue: QueuedMessage[] = await this.find({
                where: {
                    Status: QueuedMessageStatus.Stored
                },
                order: {
                    CreatedAt: "ASC"
                }
            });

            for (let message of queue) {
                message.Status = QueuedMessageStatus.Processing;
                await entityManager.update(QueuedMessage, message.Id, message);
            }

            return queue;
        });
    }

    async getStats(where: any) {
        const {Stored, QueueError, SentError} = QueuedMessageStatus;

        let WhereAnd = "";
        if (where) {
            WhereAnd = "WHERE 0 = 0";
            for(let i in where) {
                WhereAnd += ` AND "${i}" = '${where[i]}'`;
            }
        }
        const status = await getConnection().query(`
            SELECT 
                (SELECT count("Id") FROM "MessageQueue" ${WhereAnd}) as "TotalCount",
                (SELECT count("Id") FROM "MessageQueue" WHERE "Status" = ${Stored}) as "Stored",
                (SELECT count("Id") FROM "MessageQueue" WHERE "Status" = ${QueueError}) as "QueueError", 
                (SELECT count("Id") FROM "MessageQueue" WHERE "Status" = ${SentError}) as "SentError" 
        `);

        return {
            TotalCount: status[0].TotalCount,
            Stored: status[0].Stored,
            QueueError: status[0].QueueError,
            SentError: status[0].SentError,
        };
    }
}

