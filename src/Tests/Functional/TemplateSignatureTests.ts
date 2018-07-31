"use strict";

import { FunctionalTestCase, RequestChain, Chai } from "../TestCase";

describe(__filename, FunctionalTestCase({rebuild: true}, () => {

    it("test signature CRUDs", (done) => {

        let Signature: number = 0;
        const SignatureData = {
            Description: `test signature ${Math.random()}`,
            Content: `test signature ${Math.random()}`,
        };
        const url = "/api/template-signature";
        let lastCount: number = 0;
        const getAndCount = (count?: number) => {
            return {
                method: "get", url, expects: (response: any): void => {
                    lastCount = response.body.length;
                    if (count) {
                        Chai.expect(lastCount).to.be.eq(count);
                    }
                }
            };
        };

        RequestChain(done, [
            getAndCount(),
            {
                method: "post", url, data: SignatureData, expects: (response: any): void => {
                    Signature = response.body.Id;
                }
            },
            // getAndCount(lastCount + 1),
            {
                method: "put", url: () => { return `${url}/${Signature}`; },
                data: () => {
                    return {...SignatureData, ...{Content: "test"}};
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Content).to.be.eq("test");
                }
            },
            {
                method: "get", url: () => { return `${url}/${Signature}`; },
                expects: (response: any): void => {
                    Chai.expect(response.body.Id).to.be.eq(Signature);
                }
            },
            {
                method: "delete", url: () => { return `${url}/${Signature}`; },
                expects: (response: any): void => {
                    Chai.expect(response.body.success).to.be.eq(true);
                }
            }
        ]);
    });

}));
