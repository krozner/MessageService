"use strict";

import { FunctionalTestCase, RequestChain, Chai } from "../TestCase";

describe(__filename, FunctionalTestCase({rebuild: true}, () => {

    it("test message CRUDs", (done) => {

        let TemplateCount = 0;
        let MessageCount = 0;
        let Template: number = 0;
        let Sender: number = 0;
        const message = {
            Description: "test message",
            Subject: `test subject ${Math.random()}`
        };
        const OrderAcceptedData = {
            Teacher: {
                Recipients: [{ "Name": "Teacher", "Email": "teacher@euvic.pl" }],
                Tags: [
                    { "Name": "FirstName", "Value": "TeacherName" },
                    { "Name": "LastName", "Value": "TeacherLastName" }
                ]
            },
            Customer: {
                Recipients: [{ "Name": "Customer", "Email": "customer@euvic.pl" }],
                Tags: [
                    { "Name": "FirstName", "Value": "CustomerName" },
                    { "Name": "LastName", "Value": "CustomerLastName" }
                ]
            }
        };
        const url = "/api/message";
        const getAndCount = (count: number) => {
            return {
                method: "get", url, expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(count);
                }
            };
        };

        RequestChain(done, [
            {
                method: "get", url: "/api/message-action", expects: (response: any): void => {
                    Chai.expect(response.body.length > 1).to.be.eq(true);
                }
            },
            {
                method: "get", url: "/api/template", expects: (response: any): void => {
                    TemplateCount = response.body.length;
                    Chai.expect(TemplateCount > 0).to.be.eq(true);
                    Template = response.body[0].Id;
                }
            },
            {
                method: "get", url: "/api/message-sender", expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(1);
                    Sender = response.body[0].Id;
                }
            },
            {
                method: "get", url, expects: (response: any): void => {
                    MessageCount = response.body.length;
                    Chai.expect(MessageCount > 0).to.be.eq(true);
                }
            },
            {
                method: "post", url, data: () => {
                    return {...message, ...{Template, Sender}};
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Subject).to.be.eq(message.Subject);
                }
            },
            getAndCount(4),
            {
                method: "get", url: "/api/message-queue", expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(0);
                }
            },
            {
                method: "post", url: "/api/send-message/email-vikarie/order-accepted", data: OrderAcceptedData,
                expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(2);
                }
            },
            {
                method: "post", url: "/api/send-message/email-lara/order-accepted", data: OrderAcceptedData,
                expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(0);
                }
            },
            {
                method: "get", url: "/api/message-queue", expects: (response: any): void => {
                    Chai.expect(response.body.length).to.be.eq(2);
                }
            },
            {
                method: "post", url, data: () => {
                    return {...{...message, Actions: [1]}, ...{Template, Sender}};
                },
                expects: (response: any): void => {
                    Chai.expect(response.body.Subject).to.be.eq(message.Subject);
                }
            },
        ]);
    });

}));
