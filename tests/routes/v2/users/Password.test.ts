
import {
    createNewUser,
    generateAccessToken,
    testEmail,
    testHash,
    testSalt,
    testSession
} from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { PasswordResetQueries } from "../../../../src/database/query/PasswordResetQueries";
import { UsersQueries } from "../../../../src/database/query/UsersQueries";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

const usersQueries = new UsersQueries();
const passwordResetQueries = new PasswordResetQueries();

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

const url = "/v2/users/password";

describe(url, () => {
    describe("PUT", () => {

        it("should be possible to change password", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    pass: "Test12345#"
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await usersQueries.GetLoginData(testUserId);

            expect(databaseResult).toHaveProperty("hash");
            expect(databaseResult.hash).toBe("6b170c369b15eff255c91499d381b56c12bb8f1339cc11f767b4b0c4df5d6004ad4800b0240bbde4bff39190cc59c69420e02d2574a7a0f4e9531f5167d83602");
            expect(databaseResult).toHaveProperty("session");
            expect(databaseResult.session).not.toBe(testSession);
            expect(databaseResult).toHaveProperty("salt");
            expect(databaseResult.salt).toBe(testSalt);

            // try again with new sessions
            const resultSecondIteration = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId, databaseResult.session))
                .send({
                    pass: "Test1234#"
                });
            expect(resultSecondIteration.status).toBe(200);
            expect(resultSecondIteration.body).toHaveProperty("data");
            expect(resultSecondIteration.body.data).toHaveLength(0);

            // check code
            expect(resultSecondIteration.body).toHaveProperty("code");
            expect(resultSecondIteration.body.code).toBe(200);

            // check database
            const databaseResultSecondIteration = await usersQueries.GetLoginData(testUserId);

            expect(databaseResultSecondIteration).toHaveProperty("hash");
            expect(databaseResultSecondIteration.hash).toBe(testHash);
            expect(databaseResultSecondIteration).toHaveProperty("session");
            expect(databaseResultSecondIteration.session).not.toBe(testSession);
            expect(databaseResultSecondIteration).toHaveProperty("salt");
            expect(databaseResultSecondIteration.salt).toBe(testSalt);
        });

        it("should not be possible to change password with too few chars", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    pass: "t1#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1033);
        });

        it("should not be possible to change password when password is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send();

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change password when access-token is missing", async () => {
            await createNewUser({});

            const result = await request(app)
                .put(url)
                .send({
                    pass: "Test1234#"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
        });
    });

    describe("POST", () => {

        it("should be possible send password reset request", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .post(url)
                .send({
                    email: testEmail
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await passwordResetQueries.GetPasswordReset(testUserId);

            expect(databaseResult).toHaveProperty("created");
            const created = new Date (databaseResult.created).valueOf();
            expect(databaseResult).toHaveProperty("expired");
            const expired = new Date (databaseResult.expired).valueOf();
            expect(expired > created);
            expect(databaseResult).toHaveProperty("secret");
            expect(databaseResult).toHaveProperty("used");
            expect(databaseResult.used).toBe(0);

        });

        it("should be possible send password reset request with non-existing mail", async () => {
            await createNewUser({});
            const newEmailAddress = "fake@clippic.app";

            const result = await request(app)
                .post(url)
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);
        });

        it("should be possible send password reset request with max chars", async () => {
            await createNewUser({});
            const newEmailAddress = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-123@clippic.app";

            const result = await request(app)
                .post(url)
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);
        });

        it("should not be possible send password reset request with invaild email format", async () => {
            await createNewUser({});
            const newEmailAddress = "test";

            const result = await request(app)
                .post(url)
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible send password reset request with too many chars", async () => {
            await createNewUser({});
            const newEmailAddress = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-1234@clippic.app";

            const result = await request(app)
                .post(url)
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible send password reset request when email is missing", async () => {
            await createNewUser({});
            const newEmailAddress = "";

            const result = await request(app)
                .post(url)
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

    });
});
