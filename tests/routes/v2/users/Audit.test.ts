import { createNewUser, generateAccessToken } from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");

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

const url = "/v2/users/audit";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get audit data", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .get(url)
                .set("x-access-token", generateAccessToken(testUserId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check audit fields
            expect(result.body.data[0]).toHaveProperty("userId");
            expect(result.body.data[0].userId).toBe(testUserId);
            expect(result.body.data[0]).toHaveProperty("modified");
            expect(result.body.data[0].modified).not.toBeNull();
            expect(result.body.data[0]).toHaveProperty("created");
            expect(result.body.data[0].created).not.toBeNull();
            expect(result.body.data[0]).toHaveProperty("username");
            expect(result.body.data[0]).toHaveProperty("forename");
            expect(result.body.data[0]).toHaveProperty("surname");
            expect(result.body.data[0]).toHaveProperty("email");
            expect(result.body.data[0]).toHaveProperty("hash");
            expect(result.body.data[0]).toHaveProperty("billing");
            expect(result.body.data[0]).toHaveProperty("shipping");
            expect(result.body.data[0]).toHaveProperty("quota");
        });


    });

});
