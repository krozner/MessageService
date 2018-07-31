"use strict";

import { FunctionalTestCase, RequestChain, Chai } from "../TestCase";

describe(__filename, FunctionalTestCase({rebuild: true}, () => {

    it("test template constant CRUDs", (done) => {

        let ConstantId: number = 0;
        let ConstantCount: number = 0;

        const data = {
            Name: `ConstName`,
            Value: `const value`,
        };

        const url = "/api/template-constant";
        const getAndCount = (count: number) => {
            return {
                method: "get", url, expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(count);
                }
            };
        };

        RequestChain(done, [
            {
                method: "get", url, expects: (response: any): void => {
                    ConstantCount = response.body.length;
                }
            },
            {
                method: "post", url, data, expects: (response: any): void => {
                    Chai.expect(response.body.Name).to.be.eq(data.Name);
                    Chai.expect(response.body.Id).to.be.an("number");
                    ConstantId = response.body.Id;
                }
            },
            {
                method: "put", url: () => { return `${url}/${ConstantId}`; }, data: () => {
                    return {...data, Name: "test"}
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Name).to.be.eq("test");
                }
            },
            getAndCount(3),
            {
                method: "delete", url: () => { return `${url}/${ConstantId}`; }
            },
            getAndCount(2),
        ]);
    });

}));
