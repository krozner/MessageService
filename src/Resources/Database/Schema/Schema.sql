DROP TABLE IF EXISTS "Migrations";
DROP TABLE IF EXISTS "MessageQueue";
DROP TABLE IF EXISTS "MessageAction";
DROP TABLE IF EXISTS "Message";
DROP TABLE IF EXISTS "MessageSender";
DROP TABLE IF EXISTS "Template";
DROP TABLE IF EXISTS "TemplateConstant";
DROP TABLE IF EXISTS "TemplateSignature";
DROP TABLE IF EXISTS "Action";
DROP TABLE IF EXISTS "MessageType";

CREATE TABLE "MessageType" (
  "Id"          INTEGER PRIMARY KEY,
  "Description" VARCHAR(255) NOT NULL
);

CREATE TABLE "Action" (
  "Id"          INTEGER PRIMARY KEY,
  "Description" VARCHAR(255)                            NOT NULL,
  "TypeId"      INTEGER REFERENCES "MessageType" ("Id") NOT NULL
);

CREATE TABLE "TemplateSignature" (
  "Id"          SERIAL PRIMARY KEY,
  "Description" VARCHAR(255) NOT NULL,
  "Content"     TEXT         NOT NULL
);

CREATE TABLE "Template" (
  "Id"          SERIAL PRIMARY KEY,
  "TypeId"      INTEGER REFERENCES "MessageType" ("Id") NOT NULL,
  "Description" VARCHAR(255)                            NOT NULL,
  "Content"     TEXT                                    NOT NULL,
  "SignatureId" INTEGER REFERENCES "TemplateSignature" ("Id") DEFAULT NULL
);

CREATE TABLE "TemplateConstant" (
  "Id"    SERIAL PRIMARY KEY,
  "Name"  VARCHAR(255) NOT NULL UNIQUE,
  "Value" VARCHAR(255) DEFAULT NULL
);


CREATE TABLE "MessageSender" (
  "Id"          SERIAL PRIMARY KEY,
  "Description" VARCHAR(255) NOT NULL,
  "Payload"     TEXT         NOT NULL,
  "CreatedAt"   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Message" (
  "Id"          SERIAL PRIMARY KEY,
  "Description" VARCHAR(255)                              NOT NULL,
  "Subject"     VARCHAR(255)                              NOT NULL,
  "TemplateId"  INTEGER REFERENCES "Template" ("Id")      NOT NULL,
  "SenderId"    INTEGER REFERENCES "MessageSender" ("Id") NOT NULL,
  "CreatedAt"   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "MessageAction" (
  "MessageId" INTEGER REFERENCES "Message" ("Id") NOT NULL,
  "ActionId"  INTEGER REFERENCES "Action" ("Id")  NOT NULL,
  "CreatedAt" TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY ("MessageId", "ActionId")
);

CREATE TABLE "MessageQueue" (
  "Id"        SERIAL PRIMARY KEY,
  "UUID"      UUID DEFAULT uuid_generate_v4()     NOT NULL,
  "MessageId" INTEGER REFERENCES "Message" ("Id") NOT NULL,
  "Payload"   TEXT                                NOT NULL,
  "Status"    SMALLINT  DEFAULT NULL,
  "Log"       TEXT      DEFAULT NULL,
  "CreatedAt" TIMESTAMP DEFAULT NOW(),
  "UpdatedAt" TIMESTAMP DEFAULT NULL
);

INSERT INTO "MessageType" ("Id", "Description")
VALUES
  (1, 'Email message'),
  (2, 'Intercom message');
