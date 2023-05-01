import {
    createNewQuota,
    generateAccessToken,
    testEnoughRequestSpace,
    testNotEnoughRequestSpace,
    testTotalSpace,
    testUsedSpace,
} from "../../../classes/CommonTests";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { PostConsumptionRequest } from "../../../../src/models/internalQuota/PostConsumptionRequest";
import request from "supertest";
import { UsersQuota } from "../../../../src/database/entity/UsersQuota";

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
