import {
    createNewBilling,
    createNewUser,
    generateAccessToken,
    testBox,
    testCity,
    testCompany,
    testCountry,
    testForename,
    testState,
    testStreet,
    testStreetNumber,
    testSurname,
    testZip,
} from "../../../classes/CommonTests";

import { AuditQueries } from "../../../../src/database/query/AuditQueries";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import Country from "../../../../src/classes/Country";
import { GetBillingResponseData } from "../../../../src/models/billing/GetBillingResponse";
import { PutBillingRequest } from "../../../../src/models/billing/PutBillingRequest";
import { PutBillingResponse } from "../../../../src/models/billing/PutBillingResponse";
import { UsersBilling } from "../../../../src/database/entity/UsersBilling";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../../src/app");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

const auditQueries = new AuditQueries();

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

const BILLING_ROUTE = "/v2/users/billing";

describe(BILLING_ROUTE, () => {

    describe("GET", () => {

        it("should return the expected billing when querying with exiting id", async () => {
            const newBillingId = await createNewBilling({});

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

        });

        it("should return 400 when querying with non-exiting billingId", async () => {
            const userId = await createNewUser({});

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId));

            expect(result.status).toBe(400);

            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1024);

        });

        it("should return the relevant country data for the billing", async () => {
            const allCountries = new Country();
            const usa = allCountries.getCountryByISO3("USA");
            const newBillingId = await createNewBilling({ country: usa.id });

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));


            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const billing = result.body.data[0];
            const expectedCountryData: Partial<GetBillingResponseData> = {
                countryName: usa.name,
                countryISO2: usa.iso2,
                countryISO3: usa.iso3
            };
            expect(billing).toMatchObject(expectedCountryData);
        });

        it("should return all the expected billing properties for a billing", async () => {
            const newBilling: Partial<UsersBilling> = {
                company: testCompany,
                forename: testForename,
                surname: testSurname,
                zip: testZip,
                city: testCity,
                state: testState,
                box: testBox,
                street: testStreet,
                streetNumber: testStreetNumber,
            };

            const newBillingId = await createNewBilling(newBilling);

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const createdBilling = result.body.data[0];
            expect(createdBilling).toMatchObject(newBilling);
        });
    });

    describe("PUT", () => {
        it("should create the billing and return billing response", async () => {
            const userId = await createNewUser({});
            const billingRequest: PutBillingRequest = {
                company: testCompany,
                forename: testForename,
                surname: testSurname,
                zip: testZip,
                city: testCity,
                state: testState,
                box: testBox,
                street: testStreet,
                streetNumber: testStreetNumber,
                country: testCountry,
            };
            const result = await request(app)
                .put(BILLING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId))
                .send(billingRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const billingResponse: PutBillingResponse = result.body.data[0];
            const allCountries = new Country();
            const usa = allCountries.getCountryByISO3("USA");
            delete billingRequest.country;
            expect(billingResponse).toMatchObject({
                ...billingRequest,
                countryISO2: usa.iso2,
                countryISO3: usa.iso3,
                countryName: usa.name
            }
            );
        });

        it("should only update the modified fields", async () => {
            const existingBillingId = await createNewBilling({
                forename: testForename,
                surname: testSurname,
            });

            const updateBillingRequest: PutBillingRequest = {
                forename: "Rachel",
                surname: "Smith",
                country: testCountry,
                zip: testZip,
                city: testCity,
                box: testBox,
            };
            const result = await request(app)
                .put(BILLING_ROUTE)
                .set("id", existingBillingId)
                .set("x-access-token", generateAccessToken(existingBillingId))
                .send(updateBillingRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            // check code
            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const billingResponse: PutBillingResponse = result.body.data[0];
            expect(billingResponse).toMatchObject({
                forename: "Rachel",
                surname: "Smith"
            });
        });

        //  This test waits 1s to assert that the audit timestamp has been updated.
        it("should update the audit timestamp in audit table", async () => {
            const newBillingId = await createNewBilling({
                forename: testForename,
                surname: testSurname,
            });
            const initialAudit = await auditQueries.GetUsersAuditAll(newBillingId);

            const updateBillingRequest: PutBillingRequest = {
                company: testCompany,
                country: testCountry,
                zip: testZip,
                city: testCity,
                box: testBox,
            };
            await waitSeconds(1);

            await request(app)
                .put(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId))
                .send(updateBillingRequest);

            const audit = await auditQueries.GetUsersAuditAll(newBillingId);
            expect(getTime(audit.modified)).toBeGreaterThan(getTime(initialAudit.modified));
            expect(getTime(audit.billing)).toBeGreaterThan(getTime(initialAudit.billing));

            function getTime(timestamp: string): number {
                return new Date(timestamp).getTime();
            }

            function waitSeconds(seconds: number): Promise<void> {
                return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            }
        });

        describe("optional values validations", () => {
            describe("company, forename and surname validation", () => {
                it("should return error when creating billing with both company and forename + surname missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        box: testBox,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(400);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(0);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(1102);
                    expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: either company, or forename + surname are required");
                });

                it("should create billing when company is provided even when forename and surname are missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        box: testBox,
                        company: testCompany,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(1);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(200);
                });

                it("should create billing when forename + surname are provided even when company is missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        box: testBox,
                        forename: testForename,
                        surname: testSurname,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(1);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(200);
                });
            });
            describe("box, state, street and street number validation", () => {
                it("should return error when creating billing with both box and state + street + street number missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        company: testCompany,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(400);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(0);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(1102);
                    expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: either box, or state, street and street number are required");
                });

                it("should create billing when box is provided even when state + street + street number are missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        company: testCompany,
                        box: testBox,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(1);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(200);
                });

                it("should create billing when state + street + street number provided even when box is missing", async () => {
                    const userId = await createNewUser({});
                    const billingRequest: PutBillingRequest = {
                        country: testCountry,
                        zip: testZip,
                        city: testCity,
                        company: testCompany,
                        state: testState,
                        street: testStreet,
                        streetNumber: testStreetNumber,
                    };

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                    expect(result.body).toHaveProperty("data");
                    expect(result.body.data).toHaveLength(1);

                    // check code
                    expect(result.body).toHaveProperty("code");
                    expect(result.body.code).toBe(200);
                });
            });
        });

        describe("min and max length validations", () => {
            it("should return error when creating billing with company length over 150 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    company: "x".repeat(151),
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with forename length over 100 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: "x".repeat(101),
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with surname length over 100 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: "x".repeat(101),
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with zip length over 20 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: "x".repeat(21),
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with zip length under 1 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: "",
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with city length over 50 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: "x".repeat(51),
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with city length under 1 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: "",
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with state length over 50 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    state: "x".repeat(51),
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with box length over 50 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: "x".repeat(51),
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with street length over 150 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    street: "x".repeat(151),
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with streetNumber length over 20 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    streetNumber: "x".repeat(21),
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with country length over 3 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: "ABCD",
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });

            it("should return error when creating billing with country length under 2 chars", async () => {
                const userId = await createNewUser({});

                const billingRequest: PutBillingRequest = {
                    country: "A",
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                };
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                // check code
                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            });
        });
    });
});
