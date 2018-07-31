"use-strict";

import * as express from "express";
import { BasicAuth } from "../Middlewares/Auth/BasicAuth";

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

export const Swagger = (app: express.Application, swaggerOptions: {}) => {
    const showExplorer = false;
    const customCss = ".topbar { display: none; } "
        + ".opblock-summary-description { text-align: right; padding-right: 10px; }"
        + ".parameter__name {} "
        + ".parameter__type { margin: 0 5px 0 0; padding: 0 !important; float: left; }"
        + ".parameter__in { margin: 0 5px 0 0; float: left; }"
        + ".information-container .info { margin: 25px 0; }";

    const options = Object.assign({
            docExpansion: "open",
            apis: [
                `${__dirname}/../Modules/*/Controller/*Controller.js`
            ]
        }, swaggerOptions);

    const doc = swaggerJSDoc(options);

    app.use("/api-docs", BasicAuth);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(doc, showExplorer, options, customCss));
};
