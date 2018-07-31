"use strict";

import "reflect-metadata";
import * as logger from "morgan";
import * as fs from "fs";
import * as express from "express";
import { useContainer, useExpressServer, Action } from "routing-controllers";
import { Container } from "typedi";
import { Swagger }  from "./Utils/Swagger";
import { createConnection } from "typeorm";

export const FrameworkModulePath = (key: string) => {

    const pathStorage: string[] = [];
    const APP_PATH = `${process.env.APP_PATH}`;

    const paths: { [key: string]: any } = {
        controllers: () => {
            return (moduleName: string, storage: any) => {
                storage.push(`${APP_PATH}/build/Modules/${moduleName}/Controller/*Controller.js`);
            };
        },
        entities: () => {
            return (moduleName: string, storage: any) => {
                const path = `${APP_PATH}/build/Modules/${moduleName}/Entity`;
                if (fs.existsSync(path)) {
                    storage.push(`${path}/*.js`);
                }
            };
        },
        middlewares: () => {
            pathStorage.push(`${APP_PATH}/build/Middlewares/**/*.js`);
            return (moduleName: string, storage: any) => {
                const path = `${APP_PATH}/build/Modules/${moduleName}/Middleware`;
                if (fs.existsSync(path)) {
                    storage.push(`${path}/*.js`);
                }
            };
        },
        views: () => {
            pathStorage.push(`${APP_PATH}/src/Resources/Views`);
            return (moduleName: string, storage: any) => {
                const path = `${APP_PATH}/src/Modules/${moduleName}/Resources/Views`;
                if (fs.existsSync(path)) {
                    storage.push(path);
                }
            };
        },
    };

    paths[key]();
    Server.modules.forEach(moduleName => {
        paths[key]()(moduleName, pathStorage);
    });
    return pathStorage;
};

abstract class BaseServer {

    protected abstract init(): void;
    protected async authorizationChecker(action: Action, roles?: string[]): Promise<boolean> {
        throw new Error("Method authorizationChecker not implemented.");
    }
    static modules: string[] = [];

    static bootstrap(): Server {
        throw new Error("Method bootstrap not implemented.");
    }

    private readonly express: express.Application;

    get expressApp(): express.Application {
        return this.express;
    }

    static instance: BaseServer;

    protected constructor() {
        // load env variables
        require("node-env-file")(`${__dirname}/../.env`);
        const { APP_PATH, APP_CORS_ORIGIN, COOKIE_SECRET } = process.env;

        BaseServer.instance = this;

        this.express = express();
        this.express.use(require("cors")({
            origin: `${APP_CORS_ORIGIN}`.split(","),
            credentials: true
        }));
        /** uncomment if uploads needed */
        // this.express.use(require("express-fileupload")());

        useContainer(Container);

        useExpressServer(this.express, {
            controllers: FrameworkModulePath("controllers"),
            middlewares: FrameworkModulePath("middlewares"),
            authorizationChecker: this.authorizationChecker,
            defaultErrorHandler: true // dev
        });

        if (this.express.get("env") === "development") {
            this.express.use(logger("dev"));
        }

        const bodyParser = require("body-parser");
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: false
        }));

        this.express.use(require("cookie-parser")(COOKIE_SECRET));

        this.express.set("view engine", "ejs");
        this.express.set("views", FrameworkModulePath("views"));

        const { config } = require(`${APP_PATH}/build/Configs/Database.js`);

        createConnection(config)
            .then(connection => {
                this.dbConnection = connection;
            })
            .catch(error => console.log(error));

        this.init();
    }

    public dbConnection: any;
}

export class Server extends BaseServer {

    static bootstrap(): Server {
        return new Server();
    }

    static get modules(): string[] {
        return ["Common", "Template", "Message", "EmailMessage", "EmailMessageWorker"];
    }

    protected async authorizationChecker(action: Action, roles?: string[]) {
        return true;
        // const token = action.request.headers["authorization"];
        // if (! token || ! token.match(/Token [a-z0-9]+/ig)) {
        //     throw new Error("Invalid request: malformed authorization header");
        // }
        //
        // const { API_AUTH_USER, API_AUTH_CLIENT } = process.env;
        //
        // // client role (connect) has access only to "SendMessage" endpoints
        // if (roles.find(role => ["client"].indexOf(role) !== -1)) {
        //     return (token.toLowerCase() === `token ${API_AUTH_CLIENT}`);
        // }
        //
        // return (token.toLowerCase() === `token ${API_AUTH_USER}`);
    }

    protected init() {
        Swagger(this.expressApp, {
            swaggerDefinition: {
                securityDefinitions: {
                    apiKey: {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header"
                    }
                },
                security: [
                    {apiKey: []}
                ],
                jsonEditor: true,
            }
        });
    }
}

export const ServerRun = () => {
    // const debug = require("debug")("express:server");
    const app = Server.bootstrap().expressApp;

    const httpPort = process.env.APP_PORT;
    app.set("port", httpPort);

    const options = {
        key: fs.readFileSync(`${__dirname}/../server.key`),
        cert: fs.readFileSync(`${__dirname}/../server.crt`)
    };
    const webServer = require('https').createServer(options, app);
    // const webServer = require("http").createServer(app);

    webServer.listen(httpPort);
    webServer.on("error", (error: any) => {
        if (error.syscall !== "listen") {
            throw error;
        }
        switch (error.code) {
            case "EACCES":
                console.error(`Port ${httpPort} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`Port ${httpPort} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    webServer.on("listening", () => {
        console.log("\x1b[33m%s\x1b[0m", `Listening on port: ${httpPort}`);
    });
};
