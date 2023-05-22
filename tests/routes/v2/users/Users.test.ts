import {
    createNewBilling,
    createNewQuota,
    createNewShipping,
    createNewUser,
    generateAccessToken
} from "../../../classes/CommonTests";
import { AuditQueries } from "../../../../src/database/query/AuditQueries";
import { BillingQueries } from "../../../../src/database/query/BillingQueries";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { QuotaQueries } from "../../../../src/database/query/QuotaQueries";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest";
import { ShippingQueries } from "../../../../src/database/query/ShippingQueries";
import { UsersPasswordReset } from "../../../../src/database/entity/UsersPasswordReset";
import { UsersQueries } from "../../../../src/database/query/UsersQueries";
import { UsersStripe } from "../../../../src/database/entity/UsersStripe";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
const usersQueries = new UsersQueries();
const billingQueries = new BillingQueries();

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

const USERS_ROUTE = "/v2/users";
describe(USERS_ROUTE, () => {

    describe("DELETE", () => {
        it("should be possible to delete user", async () => {
            const userId = await createNewUser({});
            const result = await request(app)
                .delete(USERS_ROUTE)
                .set("x-access-token", generateAccessToken(userId));

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            expect(result.body).toHaveProperty("code");
            expect(result.body.message).toBe("User has been deleted");
            const response = await usersQueries.GetUserById(userId);
            expect(response).toBeNull();
        });

        it("should not be possible to delete not logged-in user", async () => {
            const result = await request(app)
                .delete(USERS_ROUTE)
                .set("x-access-token", "invalid");

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1001);
        });

        it("when creating a user and a related entities, deleting the user will delete the user and all related entities", async () => {
            const userId = await createNewUser({});
            await createNewBilling({ userId });
            await createNewShipping({ userId });
            await createNewQuota({ userId });
            await createResetPassword(userId);
            await createStripe(userId);

            const user = await usersQueries.GetUserById(userId);

            expect(user).not.toBeNull();
            expect(await user.billing).not.toBeNull();
            expect(await user.shipping).not.toBeNull();
            expect(await user.quota).not.toBeNull();
            expect(await user.audit).not.toBeNull();
            expect(await user.passwordReset).not.toBeNull();
            expect(await user.stripe).not.toBeNull();

            await usersQueries.DeleteUser(userId);

            expect(await usersQueries.GetUserById(userId)).toBeNull();
            expect(await billingQueries.GetBilling(userId)).toBeNull();
            expect(await new ShippingQueries().GetShippings(userId)).toHaveLength(0);
            expect(await new QuotaQueries().GetUsersQuotaAll(userId)).toBeNull();
            expect(await new AuditQueries().GetUsersAuditAll(userId)).toBeNull();
            expect(await ClippicDataSource.getRepository(UsersPasswordReset).findOneBy({ userId })).toBeNull();
            expect(await ClippicDataSource.getRepository(UsersStripe).findOneBy({ userId })).toBeNull();
        });
    });
});

async function createResetPassword(userId: string) {
    const passwordReset = new UsersPasswordReset();
    passwordReset.userId = userId;
    passwordReset.created = new Date().toString();
    passwordReset.expired = new Date().toString();
    passwordReset.secret = 1;
    passwordReset.used = true;
    await ClippicDataSource.getRepository(UsersPasswordReset).save(passwordReset);
}

async function createStripe(userId: string) {
    const stripe = new UsersStripe();
    stripe.userId = userId;
    await ClippicDataSource.getRepository(UsersStripe).save(stripe);
}
