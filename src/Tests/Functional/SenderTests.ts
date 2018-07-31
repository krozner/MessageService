"use strict";

import { FunctionalTestCase, RequestChain, Chai } from "../TestCase";

describe(__filename, FunctionalTestCase({rebuild: true}, () => {

    it("test sender CRUDs", (done) => {

        let SenderId: number = 0;
        const data = {
            "Description": "Test sender",
            "Name": `John Doe ${Math.random()}`,
            "Email": "test@euvic.pl"
        };
        const url = "/api/message-sender";

        RequestChain(done, [
            {
                method: "get", url, expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(1);
                    SenderId = response.body[0].Id;
                }
            },
            {
                method: "post", url, data,
                expects: (response: any): void => {
                    Chai.expect(response.body.Payload.Name).to.be.eq(data.Name);
                }
            },
            {
                method: "put", url: () => { return `${url}/${SenderId}`; }, data: () => {
                    return {...data, Name: "newName"}
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Payload.Name).to.be.eq("newName");
                }
            },
            {
                method: "get", url, expects: (response: any): void => {
                    response.body.forEach((sender: any) => {
                        Chai.expect(sender.Id).to.be.an("number");
                        if (sender.Id === SenderId) {
                            Chai.expect(sender.Payload.Name).to.be.eq("newName");
                        }
                    });
                }
            },
            {
                method: "delete", url: () => { return `${url}/2`; },
                expects: (response: any): void => {
                    Chai.expect(response.statusCode).to.be.eq(200);
                }
            },
        ]);
    });

}));
