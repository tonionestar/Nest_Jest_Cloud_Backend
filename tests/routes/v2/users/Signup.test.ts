import {
    createNewUser,
    testEmail,
    testPassword,
    testUsername
} from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { UserQueries } from "../../../../src/database/query/UserQueries";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

const db = new UserQueries();

jest.mock("email-templates");

beforeAll(async () => {
    await ClippicDataSource.initialize()
        .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });
});

afterAll(async () => {
    await ClippicDataSource.destroy();
});

beforeEach(async () => {
    await ClippicDataSource.synchronize();
});

afterEach(async () => {
    await ClippicDataSource.dropDatabase();
});

const url = "/v2/users/signup";

describe(url, () => {
    describe("POST", () => {

        it("should be possible to signup", async () => {
            const username: string = testUsername;
            const email: string = testEmail;

            const result = await request(app)
                .post(url)
                .send({
                    username: username,
                    email: email,
                    pass: testPassword
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check fields
            expect(result.body.data[0]).toHaveProperty("id");
            expect(result.body.data[0].id).toHaveLength(36);
            expect(result.body.data[0]).toHaveProperty("token");
            expect(result.body.data[0].token).not.toEqual("");

            // check database
            const databaseResult = await db.GetSignupData(result.body.data[0].id);

            expect(databaseResult).toHaveProperty("hash");
            expect(databaseResult.hash).not.toBeNull();
            expect(databaseResult).toHaveProperty("session");
            expect(databaseResult.session).not.toBeNull();
            expect(databaseResult).toHaveProperty("salt");
            expect(databaseResult.salt).not.toBeNull();
            expect(databaseResult).toHaveProperty("email");
            expect(databaseResult.email).toBe(email);
            expect(databaseResult).toHaveProperty("username");
            expect(databaseResult.username).toBe(username);
        });

        it("should be possible to signup with max username chars", async () => {
            const username = "testerwithmax40charstesterwithmax40chars";
            const email: string = testEmail;

            const result = await request(app)
                .post(url)
                .send({
                    username: username,
                    email: email,
                    pass: testPassword
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check fields
            expect(result.body.data[0]).toHaveProperty("id");
            expect(result.body.data[0].id).toHaveLength(36);
            expect(result.body.data[0]).toHaveProperty("token");
            expect(result.body.data[0].token).not.toEqual("");

            // check database
            const databaseResult = await db.GetSignupData(result.body.data[0].id);

            expect(databaseResult).toHaveProperty("hash");
            expect(databaseResult.hash).not.toBeNull();
            expect(databaseResult).toHaveProperty("session");
            expect(databaseResult.session).not.toBeNull();
            expect(databaseResult).toHaveProperty("salt");
            expect(databaseResult.salt).not.toBeNull();
            expect(databaseResult).toHaveProperty("email");
            expect(databaseResult.email).toBe(email);
            expect(databaseResult).toHaveProperty("username");
            expect(databaseResult.username).toBe(username);
        });

        it("should be possible to signup with max email chars", async () => {
            const username: string = testUsername;
            const email = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-123@clippic.app";

            const result = await request(app)
                .post(url)
                .send({
                    username: username,
                    email: email,
                    pass: testPassword
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check fields
            expect(result.body.data[0]).toHaveProperty("id");
            expect(result.body.data[0].id).toHaveLength(36);
            expect(result.body.data[0]).toHaveProperty("token");
            expect(result.body.data[0].token).not.toEqual("");

            // check database
            const databaseResult = await db.GetSignupData(result.body.data[0].id);

            expect(databaseResult).toHaveProperty("hash");
            expect(databaseResult.hash).not.toBeNull();
            expect(databaseResult).toHaveProperty("session");
            expect(databaseResult.session).not.toBeNull();
            expect(databaseResult).toHaveProperty("salt");
            expect(databaseResult.salt).not.toBeNull();
            expect(databaseResult).toHaveProperty("email");
            expect(databaseResult.email).toBe(email);
            expect(databaseResult).toHaveProperty("username");
            expect(databaseResult.username).toBe(username);
        });

        it("should not be possible to signup with username containing too many chars", async () => {
            const username = "new-fancy-username-which-is-very-long-123";
            const email: string = testEmail;

            const result = await request(app)
                .post(url)
                .send({
                    username: username,
                    email: email,
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to signup with email containing too many chars", async () => {
            const username: string = testUsername;
            const email = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-1234@clippic.app";

            const result = await request(app)
                .post(url)
                .send({
                    username: username,
                    email: email,
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to create account with invalid email", async () => {
            const result = await request(app)
                .post(url)
                .send({
                    username: testUsername,
                    email: "test@test",
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1022);
        });

        it("should not be possible to create account with missing email", async () => {
            const result = await request(app)
                .post(url)
                .send({
                    username: testUsername,
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);
            expect(Object.keys(result.body.data[0])).toContain("body.email");
        });

        it("should not be possible to create account with missing username", async () => {
            const result = await request(app)
                .post(url)
                .send({
                    email: testEmail,
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);
            expect(Object.keys(result.body.data[0])).toContain("body.username");
        });

        it("should not be possible to create account with missing pass", async () => {
            const result = await request(app)
                .post(url)
                .send({
                    email: testEmail,
                    username: testUsername,
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);
            expect(Object.keys(result.body.data[0])).toContain("body.pass");
        });

        it("should not be possible to create account with already existing username", async () => {
            await createNewUser({});
            const result = await request(app)
                .post(url)
                .send({
                    email: "tester2@clippic.app",
                    username: testUsername,
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1048);
        });

        it("should not be possible to create account with already existing email", async () => {
            await createNewUser({});
            const result = await request(app)
                .post(url)
                .send({
                    email: testEmail,
                    username: "tester2",
                    pass: testPassword
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1023);
        });

    });
});
