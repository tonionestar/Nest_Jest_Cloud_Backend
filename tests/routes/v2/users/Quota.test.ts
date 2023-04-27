import { UsersQuota } from "../../../../src/database/entity/UsersQuota";
import {
    createNewQuota,
    createNewUser,
    generateAccessToken,
    testUsedSpace,
    testTotalSpace
} from "../../../classes/CommonTests";
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

const QUOTA_ROUTE = "/v2/users/quota";

describe(QUOTA_ROUTE, () => {

    describe("GET", () => {

        it("should return the expected quota when querying with exiting id", async () => {
            const newQuotaId = await createNewQuota({})

            const result = await request(app)
                .get(QUOTA_ROUTE)
                .set("id", newQuotaId)
                .set("x-access-token", generateAccessToken(newQuotaId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

        });

        it("should return all the expected quota properties for a quota", async () => {
            const newQuota: Partial<UsersQuota> = {
                usedSpace: testUsedSpace,
                totalSpace: testTotalSpace
            }

            const newQuotaId = await createNewQuota(newQuota)

            const result = await request(app)
                .get(QUOTA_ROUTE)
                .set("id", newQuotaId)
                .set("x-access-token", generateAccessToken(newQuotaId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const createdQuota = result.body.data[0]
            expect(createdQuota).toMatchObject({
                usedSpace: newQuota.usedSpace?.toString(),
                totalSpace: newQuota.totalSpace?.toString()
            })
        });
    })

    it("should not be possible to get quota data when access-token is missing", async () => {
        const result = await request(app)
            .get(QUOTA_ROUTE)
            .set("id", "0");

        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0);

        // check code
        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1000);
    });
})
