"use strict";

import { Server } from "../Server";
import { exec } from "child_process";

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

let server = <Server> Server.instance;
if (! server) {
    server = Server.bootstrap();
}
const app = server.expressApp;

interface IFunctionalTestCaseOptions {
    rebuild?: boolean;
    envFileLoad?: boolean;
    before?: Function;
}

export const FunctionalTestCase = (options: IFunctionalTestCaseOptions, callback: () => any) => {
    return () => {

        chai.expect(app.get("env")).to.be.eq("test");

        before((done) => {
            if (options.before) {
                options.before();
            }

            if(options.rebuild === true) {
                console.log("Database rebuilding...");
                exec("node bin/db-rebuild --test", (err, strout, stderr) => {
                    if (err) throw err;
                    done();
                });
            }
            else {
                done();
            }

        });

        callback();
    };
};

export const TestUser = {
    user: "vikarietest@gmail.com",
    pass: "test",
};

export const UserAuth = (done: Function) => {
    const token = "";
    done(token);
};

export const Chai = chai;
export const RequestAgent = chai.request(app);

interface IRequestParameters {
    method: string;
    url: any;
    data?: any;
    expects?: (response: any) => void;
}
export const RequestChain = (done: Function, requests: IRequestParameters[]) => {
    const token = "";
    const doRequest = () => {
        if (requests.length) {
            const { method, url, expects, data } = requests[0];
            const agent = RequestAgent[method](typeof(url) === "function" ? url() : url);
            if (data) {
                agent.send(typeof(data) === "function" ? data() : data);
            }
            agent
                .set("Authorization", `Bearer ${token}`)
                .end((err: Error, res: any) => {
                    if (err) {
                        throw err;
                    }
                    if (typeof(expects) === "function") {
                        expects(res);
                    }

                    requests.splice(0, 1);
                    doRequest();
                });
        }
        else {
            done();
        }
    };
    doRequest();
};
