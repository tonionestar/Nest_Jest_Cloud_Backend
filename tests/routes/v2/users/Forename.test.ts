import {
    createNewUser,
    generateAccessToken,
    testForename
} from "../../../classes/CommonTests";

import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { UsersQueries } from "../../../../src/database/query/UsersQueries";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

const usersQueries = new UsersQueries();


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

const url = "/v2/users/forename";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get forename", async () => {
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

            // check forename
            expect(result.body.data[0]).toHaveProperty("forename");
            expect(result.body.data[0].forename).toBe(testForename);
        });

        it("should not be possible to get forename when access-token is missing", async () => {
            const result = await request(app)
                .get(url);

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
        });
    });

    describe("PUT", () => {

        it("should be possible to change forename", async () => {
            const testUserId = await createNewUser({});
            const newForename = "new-fancy-forename";

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    forename: newForename
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check forename
            expect(result.body.data[0]).toHaveProperty("forename");
            expect(result.body.data[0].forename).toBe(newForename);

            // check database
            const databaseResult = await usersQueries.GetForename(testUserId);

            expect(databaseResult).toHaveProperty("forename");
            expect(databaseResult.forename).toBe(newForename);
        });

        it("should be possible to change forename with max chars", async () => {
            const testUserId = await createNewUser({});
            const newForename = "new-fancy-forename-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-12";

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    forename: newForename
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check forename
            expect(result.body.data[0]).toHaveProperty("forename");
            expect(result.body.data[0].forename).toBe(newForename);

            // check database
            const databaseResult = await usersQueries.GetForename(testUserId);

            expect(databaseResult).toHaveProperty("forename");
            expect(databaseResult.forename).toBe(newForename);
        });

        it("should not be possible to change forename with too many chars", async () => {
            const testUserId = await createNewUser({});
            const newForename = "new-fancy-forename-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-123";

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    forename: newForename
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change forename with too few chars", async () => {
            const testUserId = await createNewUser({});
            const newForename = "";

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    forename: newForename
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change forename when forename is missing", async () => {
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

        it("should not be possible to change forename when access-token is missing", async () => {
            await createNewUser({});

            const result = await request(app)
                .put(url)
                .send({
                    forename: "newForename"
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
