import {
    createNewUser,
    generateAccessToken,
    testSurname
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

const url = "/v2/users/surname";

describe(url, () => {

    describe("GET", () => {

        it("should be possible to get surname", async () => {
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

            // check surname
            expect(result.body.data[0]).toHaveProperty("surname");
            expect(result.body.data[0].surname).toBe(testSurname);
        });

        it("should not be possible to get surname when id is missing", async () => {
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

        it("should not be possible to get surname when id is wrong", async () => {
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

        it("should not be possible to get surname when access-token is missing", async () => {
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

        it("should be possible to change surname", async () => {
            const testUserId = await createNewUser({});
            const newSurname = "new-fancy-surname";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    surname: newSurname
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check surname
            expect(result.body.data[0]).toHaveProperty("surname");
            expect(result.body.data[0].surname).toBe(newSurname);

            // check database
            const databaseResult = await usersQueries.GetSurname(testUserId);

            expect(databaseResult).toHaveProperty("surname");
            expect(databaseResult.surname).toBe(newSurname);
        });

        it("should be possible to change surname with max chars", async () => {
            const testUserId = await createNewUser({});
            const newSurname = "new-fancy-surname-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-123";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    surname: newSurname
                });

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check surname
            expect(result.body.data[0]).toHaveProperty("surname");
            expect(result.body.data[0].surname).toBe(newSurname);

            // check database
            const databaseResult = await usersQueries.GetSurname(testUserId);

            expect(databaseResult).toHaveProperty("surname");
            expect(databaseResult.surname).toBe(newSurname);
        });

        it("should not be possible to change surname with too many chars", async () => {
            const testUserId = await createNewUser({});
            const newSurname = "new-fancy-surname-which-is-very-long-very-long-very-long-very-long-very-long-very-long-very-long-1234";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    surname: newSurname
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change surname with too few chars", async () => {
            const testUserId = await createNewUser({});
            const newSurname = "";

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    surname: newSurname
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change surname when surname is missing", async () => {
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

        it("should not be possible to change surname when id is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("x-access-token", generateAccessToken(testUserId))
                .send({
                    surname: "newSurname"
                });

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });

        it("should not be possible to change surname when access-token is missing", async () => {
            const testUserId = await createNewUser({});

            const result = await request(app)
                .put(url)
                .set("id", testUserId)
                .send({
                    surname: "newSurname"
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
