import Country from "../../../../src/classes/Country";
import { UsersBilling } from "../../../../src/database/entity/UsersBilling";
import { GetBillingResponseData } from "../../../../src/models/billing/GetBillingResponse";
import { PutBillingRequest } from "../../../../src/models/billing/PutBillingRequest";
import { PutBillingResponse } from "../../../../src/models/billing/PutBillingResponse";
import {
    createNewBilling,
    createNewUser,
    generateAccessToken,
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

const BILLING_ROUTE = "/v2/users/billing";

describe(BILLING_ROUTE, () => {

    describe("GET", () => {

        it("should return the expected billing when querying with exiting id", async () => {
            const newBillingId = await createNewBilling({})

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));

            expect(result.status).toBe(200);
        });

        it("should return 400 when querying with non-exiting billingId", async () => {
            const userId = await createNewUser({})

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId));

            expect(result.status).toBe(400);
        });

        it("should return the relevant country data for the billing", async () => {
            const allCountries = new Country();
            const usa = allCountries.getCountryByISO3("USA")
            const newBillingId = await createNewBilling({ country: usa.id })

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));

            const billing = result.body.data[0]
            const expectedCountryData: Partial<GetBillingResponseData> = {
                countryName: usa.name,
                countryISO2: usa.iso2,
                countryISO3: usa.iso3
            }
            expect(billing).toMatchObject(expectedCountryData);
        });

        it("should return all the expected billing properties for a billing", async () => {
            const newBilling: Partial<UsersBilling> = {
                company: "Apple",
                forename: "Steve",
                surname: "Jobs",
                zip: "5567",
                city: "LA",
                state: "California",
                box: "5acc",
                street: "Iphone st.",
                streetNumber: "3",
            }

            const newBillingId = await createNewBilling(newBilling)

            const result = await request(app)
                .get(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId));

            const createdBilling = result.body.data[0]
            expect(createdBilling).toMatchObject(newBilling)
        });
    })

    describe("PUT", () => {
        it("should create the billing and return billing response", async () => {
            const userId = await createNewUser({})
            const billingRequest: PutBillingRequest = {
                company: "Apple",
                forename: "john",
                surname: "smith",
                zip: "5ac",
                city: "LA",
                state: "California",
                box: "a",
                street: "sunset",
                streetNumber: "15",
                country: "USA"
            }
            const result = await request(app)
                .put(BILLING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId))
                .send(billingRequest);

            const billingResponse: PutBillingResponse = result.body.data[0]
            const allCountries = new Country();
            const usa = allCountries.getCountryByISO3("USA")
            delete billingRequest.country
            expect(billingResponse).toMatchObject({
                    ...billingRequest,
                    countryISO2: usa.iso2,
                    countryISO3: usa.iso3,
                    countryName: usa.name
                }
            )
        })

        it("should only update the modified fields", async () => {
            const existingBillingId = await createNewBilling({
                forename: "John",
                surname: "Smith",
            })

            const updateBillingRequest: PutBillingRequest = {
                forename: "Rachel",
                surname: "Smith",
                country: "USA",
                zip: "5ac",
                city: "LA",
                box: "a"
            }
            const result = await request(app)
                .put(BILLING_ROUTE)
                .set("id", existingBillingId)
                .set("x-access-token", generateAccessToken(existingBillingId))
                .send(updateBillingRequest);

            const billingResponse: PutBillingResponse = result.body.data[0]
            expect(billingResponse).toMatchObject({
                forename: "Rachel",
                surname: "Smith"
            })
        })

        //This test waits 1s to assert that the audit timestamp has been updated.
        it("should update the audit timestamp in audit table", async () => {
            const newBillingId = await createNewBilling({
                forename: "John",
                surname: "Smith",
            })
            const initialAudit = await db.GetUsersAuditAll(newBillingId)

            const updateBillingRequest: PutBillingRequest = {
                company: "Apple",
                country: "USA",
                zip: "5ac",
                city: "LA",
                box: "a"
            }
            await waitSeconds(1);

            await request(app)
                .put(BILLING_ROUTE)
                .set("id", newBillingId)
                .set("x-access-token", generateAccessToken(newBillingId))
                .send(updateBillingRequest);

            const audit = await db.GetUsersAuditAll(newBillingId)
            expect(getTime(audit.modified)).toBeGreaterThan(getTime(initialAudit.modified))
            expect(getTime(audit.billing)).toBeGreaterThan(getTime(initialAudit.billing))

            function getTime(timestamp: string): number {
                return new Date(timestamp).getTime();
            }

            function waitSeconds(seconds: number): Promise<void> {
                return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            }
        })

        describe("optional values validations", () => {
            describe("company, forename and surname validation", () => {
                it("should return error when creating billing with both company and forename + surname missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        box: "a",
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(400);
                    expect(JSON.parse(result.text).message).toBe("either company, or forename + surname are required ");
                })

                it("should create billing when company is provided even when forename and surname are missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        box: "a",
                        company: "apple"
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                })

                it("should create billing when forename + surname are provided even when company is missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        box: "a",
                        forename: "John",
                        surname: "Smith"
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                })
            })
            describe("box, state, street and street number validation", () => {
                it("should return error when creating billing with both box and state + street + street number missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        company: "apple"
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(400);
                    expect(JSON.parse(result.text).message).toBe("either box, or state, street and street number are required ");
                })

                it("should create billing when box is provided even when state + street + street number are missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        company: "apple",
                        box: "a"
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                })

                it("should create billing when state + street + street number provided even when box is missing", async () => {
                    const userId = await createNewUser({})
                    const billingRequest: PutBillingRequest = {
                        country: "USA",
                        zip: "5ac",
                        city: "LA",
                        company: "Apple",
                        state: "California",
                        street: "Sunset Blvd.",
                        streetNumber: "12"
                    }

                    const result = await request(app)
                        .put(BILLING_ROUTE)
                        .set("id", userId)
                        .set("x-access-token", generateAccessToken(userId))
                        .send(billingRequest);

                    expect(result.status).toBe(200);
                })
            })
        })

        describe("min and max length validations", () => {
            it("should return error when creating billing with company length over 150 chars", async () => {
                const userId = await createNewUser({})
                let longCompanyName = "";
                for (let i = 0; i < 151; i++) {
                    longCompanyName += "a"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "5ac",
                    city: "LA",
                    company: longCompanyName,
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with forename length over 100 chars", async () => {
                const userId = await createNewUser({})
                let longForename = "";
                for (let i = 0; i < 101; i++) {
                    longForename += "a"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "5ac",
                    city: "LA",
                    forename: longForename,
                    surname: "smith",
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with surname length over 100 chars", async () => {
                const userId = await createNewUser({})
                let longSurname = "";
                for (let i = 0; i < 101; i++) {
                    longSurname += "a"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "5ac",
                    city: "LA",
                    forename: "john",
                    surname: longSurname,
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with zip length over 20 chars", async () => {
                const userId = await createNewUser({})
                let longZip = "";
                for (let i = 0; i < 21; i++) {
                    longZip += "a"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: longZip,
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with zip length under 1 chars", async () => {
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with city length over 50 chars", async () => {
                let longCityName = "";
                for (let i = 0; i < 51; i++) {
                    longCityName += "a"
                }
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "aa",
                    city: longCityName,
                    forename: "john",
                    surname: "smith",
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with city length under 1 chars", async () => {
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "a",
                    city: "",
                    forename: "john",
                    surname: "smith",
                    box: "a"
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with state length over 50 chars", async () => {
                let longStateName = "";
                for (let i = 0; i < 51; i++) {
                    longStateName += "a"
                }
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "aa",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a",
                    state: longStateName
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with box length over 50 chars", async () => {
                let longBoxName = "";
                for (let i = 0; i < 51; i++) {
                    longBoxName += "a"
                }
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "aa",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: longBoxName
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with street length over 150 chars", async () => {
                const userId = await createNewUser({})
                let longStreetName = "";
                for (let i = 0; i < 151; i++) {
                    longStreetName += "a"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "5ac",
                    city: "LA",
                    company: "Apple",
                    box: "a",
                    street: longStreetName
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with streetNumber length over 20 chars", async () => {
                const userId = await createNewUser({})
                let longStreetNumber = "";
                for (let i = 0; i < 21; i++) {
                    longStreetNumber += "5"
                }

                const billingRequest: PutBillingRequest = {
                    country: "USA",
                    zip: "a",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a",
                    streetNumber: longStreetNumber
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with country length over 3 chars", async () => {
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "ABCD",
                    zip: "a",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a",
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })

            it("should return error when creating billing with country length under 2 chars", async () => {
                const userId = await createNewUser({})

                const billingRequest: PutBillingRequest = {
                    country: "A",
                    zip: "a",
                    city: "LA",
                    forename: "john",
                    surname: "smith",
                    box: "a",
                }
                const result = await request(app)
                    .put(BILLING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(billingRequest);

                expect(result.status).toBe(400);
            })
        })
    })
})