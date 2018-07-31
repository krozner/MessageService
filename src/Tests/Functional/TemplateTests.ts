
"use strict";

import { FunctionalTestCase, RequestChain, Chai } from "../TestCase";
import { MessageType } from "../../Modules/Template";

describe(__filename, FunctionalTestCase({rebuild: true}, () => {

    it("test template CRUDs", (done) => {

        let Template: number = 0;
        let Signature: number = 0;

        const TemplateData = {
            Description: `test template ${Math.random()}`,
            Content: `test template content ${Math.random()}`,
            Type: MessageType.EmailMessage,
        };

        const url = "/api/template";
        const getAndCount = (count: number) => {
            return {
                method: "get", url, expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(count);
                }
            };
        };

        RequestChain(done, [
            {
                method: "get", url: "/api/template-type", expects: (response: any): void => {
                    Chai.expect(response.body.length > 0).to.be.eq(true);
                }
            },
            {
                method: "get", url, expects: (response: any): void => {
                    // Chai.expect(response.body.length).to.be.eq(1);
                    Template = response.body[0].Id;
                }
            },
            {
                method: "get", url: () => { return `/api/template/${Template}`; }, expects: (response: any): void => {
                    Chai.expect(response.body.Id).to.be.eq(Template);
                }
            },
            {
                method: "get", url: "/api/template-signature", expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(1);
                    Signature = response.body[0].Id;
                }
            },
            {
                method: "post", url, data: () => {
                    return {...TemplateData, ...{Signature}};
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Content).to.be.eq(TemplateData.Content);
                }
            },
            getAndCount(3),
            {
                method: "delete", url: () => { return `/api/template/${++Template}`; },
                expects: (response: any): void => {}
            },
            getAndCount(2),
        ]);
    });

}));
