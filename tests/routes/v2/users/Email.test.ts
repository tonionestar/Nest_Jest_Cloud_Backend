import {
    createNewUser,
    generateAccessToken,
    testEmail
} from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { UserQueries } from "../../../../src/database/query/UserQueries";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

const db = new UserQueries();

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

const url = "/v2/users/email";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get email", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check username
            expect(result.body.data[0]).toHaveProperty("email");
            expect(result.body.data[0].email).toBe(testEmail);
        });

        it("should not be possible to get email when id is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("x-access-token", generateAccessToken(testUserId));

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to get email when id is wrong", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("id", "0")
                .set("x-access-token", generateAccessToken(testUserId));

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1001);
        });

        it("should not be possible to get email when access-token is missing", async () => {
            const result = await request(app)
                .get(url)
                .set("id", "0");

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
        });
    });

    describe("PUT", () => {

        it("should be possible to change email", async () => {
            const testUserId = await createNewUser({});
            const newEmailAddress = "tester2@clippic.app";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check username
            expect(result.body.data[0]).toHaveProperty("email");
            expect(result.body.data[0].email).toBe(newEmailAddress);

            // check database
            const databaseResult = await db.GetEmail(testUserId);

            expect(databaseResult).toHaveProperty("email");
            expect(databaseResult.email).toBe(newEmailAddress);
        });

        it("should not be possible to change email with invalid email format", async () => {
            const testUserId = await createNewUser({});
            const newEmailAddress = "testeratclippic.de";
            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1022);
        });

        it("should be possible to change email with max chars", async () => {
            const testUserId = await createNewUser({});
            const newEmailAddress = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-123@clippic.app";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: newEmailAddress
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check username
            expect(result.body.data[0]).toHaveProperty("email");
            expect(result.body.data[0].email).toBe(newEmailAddress);

            // check database
            const databaseResult = await db.GetEmail(testUserId);

            expect(databaseResult).toHaveProperty("email");
            expect(databaseResult.email).toBe(newEmailAddress);
        });

        it("should not be possible to change email with too many chars", async () => {
            const testUserId = await createNewUser({});
            const newEmailAddress = "new-fancy-email-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-very-long-1234@clippic.app";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
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

        it("should not be possible to change email when email already exists", async () => {
            const newEmailName = "tester2@clippic.app";

            const testUserId = await createNewUser({});
            await createNewUser({
                username: "tester2",
                email: newEmailName
            });

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: newEmailName
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1023);
        });

        it("should not be possible to change email with too few chars", async () => {
            const testUserId = await createNewUser({});
            const newEmailName = "a@a";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: newEmailName
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change email when email is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send();

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change email when id is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    email: "tester2@clippic.app"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change email when access-token is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .send({
                    email: "tester2@clippic.app"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
        });
    });
});
