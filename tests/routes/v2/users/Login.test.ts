import {
    createNewUser,
    insertUser,
    testEmail,
    testForename,
    testHash,
    testSalt,
    testSession,
    testSurname,
    testUsername
} from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app")

beforeAll(async () => {
    await ClippicDataSource.initialize()
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
});

afterAll(async () => {
    await ClippicDataSource.destroy();
})

beforeEach(async () => {
    await ClippicDataSource.synchronize();
});

afterEach(async () => {
    await ClippicDataSource.dropDatabase();
});

const url = "/v2/users/login"

describe(url, () => {

    describe("POST", () => {

        it("should be possible to login with email", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .post(url)
                .send({
                    "email": "tester@clippic.app",
                    "pass": "Test1234#"
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check created
            expect(result.body.data[0]).toHaveProperty("created");
            expect(result.body.data[0].created).not.toBeNull();

            // check id
            expect(result.body.data[0]).toHaveProperty("id", testUserId);

            // check last_modified
            expect(result.body.data[0]).toHaveProperty("lastModified");
            expect(result.body.data[0].last_modified).not.toBeNull();

            // token
            expect(result.body.data[0]).toHaveProperty("token");
            expect(result.body.data[0].token).not.toBeNull();
        })

        it("should be possible to login with username", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester",
                    "pass": "Test1234#"
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check created
            expect(result.body.data[0]).toHaveProperty("created");
            expect(result.body.data[0].created).not.toBeNull();

            // check id
            expect(result.body.data[0]).toHaveProperty("id", testUserId);

            // check last_modified
            expect(result.body.data[0]).toHaveProperty("lastModified");
            expect(result.body.data[0].last_modified).not.toBeNull();

            // token
            expect(result.body.data[0]).toHaveProperty("token");
            expect(result.body.data[0].token).not.toBeNull();
        })

        it("should not be possible to login with wrong password", async () => {
            await createNewUser({});

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester",
                    "pass": "Test123#2"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1025);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();
        })

        it("should not be possible to login with non-existing user", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester",
                    "pass": "Test123#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1025);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login when password missing", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)
            expect(result.body.data[0]).toStrictEqual({ "body.pass": { "message": "'pass' is required" } })

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login when username/email missing", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "password": "tester"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)
            expect(result.body.data[0]).toStrictEqual({ "body.pass": { "message": "'pass' is required" },
                "body.password": {
                    "message": "\"password\" is an excess property and therefore is not allowed",
                    "value": "password"
                }
            })

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login when username and email are provided", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "test",
                    "email": "test@clippic.app",
                    "pass": "tester"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1049);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login with wrong formatted email", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "email": "tester",
                    "pass": "Test123#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1022);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();
            expect(result.body.message).toContain("tester")

        })

        it("should not be possible to login when no audit is in database", async () => {
            await insertUser(
                testUsername,
                testEmail,
                testSalt,
                testSession,
                testHash,
                testForename,
                testSurname
            );

            const result = await request(app)
                .post(url)
                .send({
                    "email": "tester@clippic.app",
                    "pass": "Test123#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1028);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login with to long username", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "01234567890123456789012345678901234567890123456789",
                    "pass": "Test123#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login with to long email", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "01234567890123456789012345678901234567890123456789@test.de",
                    "pass": "Test123#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login with null password", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester@test.de",
                    "pass": null
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })

        it("should not be possible to login with to short password", async () => {

            const result = await request(app)
                .post(url)
                .send({
                    "username": "tester@test.de",
                    "pass": ""
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0)

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1025);

            expect(result.body).toHaveProperty("message");
            expect(result.body.message).not.toBeNull();

        })
    });
});
