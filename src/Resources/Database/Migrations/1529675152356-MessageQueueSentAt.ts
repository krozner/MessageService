import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageQueueSentAt1529675152356 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "MessageQueue" ADD "SentAt" TIMESTAMP DEFAULT NULL`);
    }

    async down(queryRunner: QueryRunner): Promise<any> {

    }


}
