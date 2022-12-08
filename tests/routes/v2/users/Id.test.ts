import { createNewUser, generateAccessToken } from "../../../classes/CommonTests";

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

const url = "/users/v2/id";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get id of other user", async () => {
            const newUserName = "new-fancy-username"
            const newUserEmail = "tester2@clippic.app"

            const testUserId = await createNewUser({});
            const testUser2Id = await createNewUser({
                username: newUserName,
                email: newUserEmail
            });

            const result = await request(app)
                .get(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .query({
                    "email": newUserEmail
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check id
            expect(result.body.data[0]).toHaveProperty("id");
            expect(result.body.data[0].id).toBe(testUser2Id);
        });

        it("should not be possible to get id of other user when using non-existing mail", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .query({
                    "email": "dumb"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1030);
        });

        it("should not be possible to get id of other user when id is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .query({
                    "email": "dumb"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to get id of other user when access-token is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("id", testUserId)
                .query({
                    "email": "dumb"
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
