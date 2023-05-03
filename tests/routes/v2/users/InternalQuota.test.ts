import {
    createNewQuota,
    generateAccessToken,
    testEnoughRequestSpace,
    testNotEnoughRequestSpace,
    testSize,
    testTotalSpace,
    testUsedSpace,
    testValidSize1,
    testValidSize2,
} from "../../../classes/CommonTests";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { PatchInternalSpaceRequest } from "../../../../src/models/internalQuota/PatchInternalSpaceRequest";
import { PostConsumptionRequest } from "../../../../src/models/internalQuota/PostConsumptionRequest";
import request from "supertest";
import { UserQueries } from "../../../../src/database/query/UserQueries";
import { UsersQuota } from "../../../../src/database/entity/UsersQuota";

const db = new UserQueries();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");

beforeAll(async () => {
    await ClippicDataSource.initialize().catch((err) => {
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

const INTERNAL_QUOTA_ROUTE = "/v2/internal/users/quota";

describe(INTERNAL_QUOTA_ROUTE, () => {
    describe("GET", () => {
        it("should return the expected quota when querying with exiting id", async () => {
            const newQuotaId = await createNewQuota({});

            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testNotEnoughRequestSpace,
            };

            const result = await request(app)
                .post(INTERNAL_QUOTA_ROUTE)
                .set("id", newQuotaId)
                .set("x-access-token", generateAccessToken(newQuotaId))
                .send(InternalQuotaRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);
        });

        it("should return false if the internalSpace is not enough", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testNotEnoughRequestSpace,
            };

            const newQuotaId = await createNewQuota(newQuota);

            const result = await request(app)
                .post(INTERNAL_QUOTA_ROUTE)
                .set("id", newQuotaId)
                .set("x-access-token", generateAccessToken(newQuotaId))
                .send(InternalQuotaRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const checkInternalQuota = result.body.data;
            expect(checkInternalQuota).toMatchObject({
                isSufficientQuota: false,
            });
        });

        it("should return true if the internalSpace is enough", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testEnoughRequestSpace,
            };

            const newQuotaId = await createNewQuota(newQuota);

            const result = await request(app)
                .post(INTERNAL_QUOTA_ROUTE)
                .set("id", newQuotaId)
                .set("x-access-token", generateAccessToken(newQuotaId))
                .send(InternalQuotaRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const checkInternalQuota = result.body.data;
            expect(checkInternalQuota).toMatchObject({
                isSufficientQuota: true,
            });
        });

        it("should not be possible to get quota data when access-token is missing", async () => {
            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testNotEnoughRequestSpace,
            };

            const result = await request(app)
                .post(INTERNAL_QUOTA_ROUTE)
                .set("id", "0")
                .send(InternalQuotaRequest);

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
        });

        it("should not be possible to get quota data when id is missing", async () => {
            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testNotEnoughRequestSpace,
            };

            const result = await request(app)
                .post(INTERNAL_QUOTA_ROUTE)
                .set(
                    "x-access-token",
                    generateAccessToken("08e40963-f4e0-4e36-a4ea-16f0196b5133")
                )
                .send(InternalQuotaRequest);

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1101);
        });
    });

    describe("PATCH", () => {
        it("should not change the usedSpace when request size exceeds the available space", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testuserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testValidSize1,
            };

            const result = await request(app)
                .patch(INTERNAL_QUOTA_ROUTE)
                .set("id", testuserId)
                .set("x-access-token", generateAccessToken(testuserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await db.GetUsersQuotaAll(testuserId);

            expect(databaseResult).toHaveProperty("usedSpace");
            expect(Number(databaseResult.usedSpace)).toBe(testUsedSpace);
        });

        it("should not change the usedSpace when request to release more than used space", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testuserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testValidSize2,
            };

            const result = await request(app)
                .patch(INTERNAL_QUOTA_ROUTE)
                .set("id", testuserId)
                .set("x-access-token", generateAccessToken(testuserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await db.GetUsersQuotaAll(testuserId);

            expect(databaseResult).toHaveProperty("usedSpace");
            expect(Number(databaseResult.usedSpace)).toBe(testUsedSpace);
        });

        it("should be possible to change consume quota", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testUserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testSize,
            };

            const result = await request(app)
                .patch(INTERNAL_QUOTA_ROUTE)
                .set("id", testUserId)
                .set("x-access-token", generateAccessToken(testUserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await db.GetUsersQuotaAll(testUserId);

            expect(databaseResult).toHaveProperty("usedSpace");
            expect(Number(databaseResult.usedSpace)).toBe(testUsedSpace + testSize);
        });
    });
});
