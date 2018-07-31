"use strict";

import { FrameworkModulePath } from "../Server";

const { NODE_ENV, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, APP_PATH } = process.env;

export const config = {
    type: "postgres",
    host: POSTGRES_HOST,
    port: parseInt(`${POSTGRES_PORT}`) | 5432,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    entities: FrameworkModulePath("entities"),
    synchronize: true,
    logging: false,
    migrationsTableName: "Migrations",
    migrations: [
        // `${APP_PATH}/build/Resources/Database/Migrations/*.js`
    ],
    cli: {
        migrationsDir: `src/Resources/Database/Migrations`
    }
};

if (NODE_ENV === "test") {
    Object.assign(config, {
         host: "database_test",
    });
}

export default config;