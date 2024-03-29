import {
    createNewQuota,
    generateAccessToken,
    testEnoughRequestSpace,
    testManageTotalValidSize,
    testNotEnoughRequestSpace,
    testReducingSize,
    testSize,
    testTotalSpace,
    testUsedSpace,
    testValidSize1,
    testValidSize2,
} from "../../../classes/CommonTests";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { PatchInternalSpaceRequest } from "../../../../src/models/internalQuota/PatchInternalSpaceRequest";
import { PostConsumptionRequest } from "../../../../src/models/internalQuota/PostConsumptionRequest";
import { QuotaQueries } from "../../../../src/database/query/QuotaQueries";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest";
import { UsersQuota } from "../../../../src/database/entity/UsersQuota";

const quotaQueries = new QuotaQueries();

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

const INTERNAL_CONSUME_QUOTA_ROUTE = "/v2/internal/users/quota";
const INTERNAL_MANAGE_QUOTA_ROUTE = "/v2/internal/users/quota/manage";

describe(INTERNAL_CONSUME_QUOTA_ROUTE, () => {
    describe("GET", () => {
        it("should return the expected quota when querying with exiting id", async () => {
            const newQuotaId = await createNewQuota({});

            const InternalQuotaRequest: PostConsumptionRequest = {
                requestSize: testNotEnoughRequestSpace,
            };

            const result = await request(app)
                .post(INTERNAL_CONSUME_QUOTA_ROUTE)
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
                .post(INTERNAL_CONSUME_QUOTA_ROUTE)
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
                .post(INTERNAL_CONSUME_QUOTA_ROUTE)
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
                .post(INTERNAL_CONSUME_QUOTA_ROUTE)
                .send(InternalQuotaRequest);

            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("data");

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1000);
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
                .patch(INTERNAL_CONSUME_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testuserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testuserId
            );

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
                .patch(INTERNAL_CONSUME_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testuserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testuserId
            );

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
                .patch(INTERNAL_CONSUME_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testUserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testUserId
            );

            expect(databaseResult).toHaveProperty("usedSpace");
            expect(Number(databaseResult.usedSpace)).toBe(
                testUsedSpace + testSize
            );
        });
    });
});

describe(INTERNAL_MANAGE_QUOTA_ROUTE, () => {
    describe("PATCH", () => {
        it("should return the MIN_TOTAL_SPACE when trying to update to a total space that is less than MIN_TOTAL_SPACE", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testuserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testManageTotalValidSize,
            };

            const result = await request(app)
                .patch(INTERNAL_MANAGE_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testuserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testuserId
            );

            expect(databaseResult).toHaveProperty("totalSpace");
            expect(Number(databaseResult.totalSpace)).toBe(5242880);
        });

        it("should return the expected total space when increasing space", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testUserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testSize,
            };

            const result = await request(app)
                .patch(INTERNAL_MANAGE_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testUserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testUserId
            );

            expect(databaseResult).toHaveProperty("totalSpace");
            expect(Number(databaseResult.totalSpace)).toBe(
                testTotalSpace + testSize
            );
        });

        it("should return the expected total space when reducing space", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testUserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testReducingSize,
            };

            const result = await request(app)
                .patch(INTERNAL_MANAGE_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testUserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testUserId
            );

            expect(databaseResult).toHaveProperty("totalSpace");
            expect(Number(databaseResult.totalSpace)).toBe(
                testTotalSpace + testReducingSize
            );
        });

        it("should not change the existing usedSpace when updating totalSpace", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace,
            };

            const testUserId = await createNewQuota(newQuota);
            const updateQuotaRequest: PatchInternalSpaceRequest = {
                size: testSize,
            };

            const result = await request(app)
                .patch(INTERNAL_MANAGE_QUOTA_ROUTE)
                .set("x-access-token", generateAccessToken(testUserId))
                .send(updateQuotaRequest);

            expect(result.status).toBe(200);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            // check database
            const databaseResult = await quotaQueries.GetUsersQuotaAll(
                testUserId
            );

            expect(databaseResult).toHaveProperty("usedSpace");
            expect(Number(databaseResult.usedSpace)).toBe(
                testUsedSpace
            );
        });
    });
});
