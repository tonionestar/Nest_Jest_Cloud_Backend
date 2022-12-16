import { createNewUser, generateAccessToken, testUsername } from "../../../classes/CommonTests";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { UserQueries } from "../../../../src/database/query/UserQueries";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app")

const db = new UserQueries();

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

const url = "/v2/users/username";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get username", async () => {
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
            expect(result.body.data[0]).toHaveProperty("username");
            expect(result.body.data[0].username).toBe(testUsername);
        });

        it("should not be possible to get username when id is missing", async () => {
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

        it("should not be possible to get username when id is wrong", async () => {
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

        it("should not be possible to get username when access-token is missing", async () => {
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

        it("should be possible to change username", async () => {
            const testUserId = await createNewUser({});
            const newUserName = "new-fancy-username"

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: newUserName
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check username
            expect(result.body.data[0]).toHaveProperty("username");
            expect(result.body.data[0].username).toBe(newUserName);

            // check database
            const databaseResult = await db.GetUsername(testUserId);

            expect(databaseResult).toHaveProperty("username");
            expect(databaseResult.username).toBe(newUserName);
        });

        it("should be possible to change username with max chars", async () => {
            const testUserId = await createNewUser({});
            const newUserName = "new-fancy-username-which-is-very-long-12"

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: newUserName
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check username
            expect(result.body.data[0]).toHaveProperty("username");
            expect(result.body.data[0].username).toBe(newUserName);

            // check database
            const databaseResult = await db.GetUsername(testUserId);

            expect(databaseResult).toHaveProperty("username");
            expect(databaseResult.username).toBe(newUserName);
        });

        it("should not be possible to change username with too many chars", async () => {
            const testUserId = await createNewUser({});
            const newUserName = "new-fancy-username-which-is-very-long-123"

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: newUserName
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change username when username already exists", async () => {
            const newUserName = "new-fancy-username"

            const testUserId = await createNewUser({});
            await createNewUser({
                username: newUserName,
                email: "tester2@clippic.app"
            });

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: newUserName
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1048);
        });

        it("should not be possible to change username with too few chars", async () => {
            const testUserId = await createNewUser({});
            const newUserName = "1"

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: newUserName
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change username when username is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send()

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change username when id is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    username: "newUserName"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change username when access-token is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .send({
                    username: "newUserName"
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
