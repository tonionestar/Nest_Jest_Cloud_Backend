import request from "supertest"
import Country from "../../../../src/classes/Country";
import { ClippicDataSource } from "../../../../src/database/DatabaseConnection";
import { ShippingType } from "../../../../src/database/entity/UsersShipping";
import { UserQueries } from "../../../../src/database/query/UserQueries";
import { PostShippingRequest } from "../../../../src/models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../../../../src/models/shipping/PutShippingRequest";
import { ShippingResponse } from "../../../../src/models/shipping/ShippingResponse";

import {
    createNewShipping,
    createNewUser,
    generateAccessToken,
    testBox,
    testCity,
    testCompany,
    testCountry,
    testForename,
    testPackstation,
    testPostnumber,
    testState,
    testStreet,
    testStreetNumber,
    testSurname,
    testZip,
} from "../../../classes/CommonTests";
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

const SHIPPING_ROUTE = "/v2/users/shipping";


describe(SHIPPING_ROUTE, () => {

    describe("GET", () => {
        describe("get all shippings by userId", () => {
            it("should succeed retrieving shipping when querying with exiting user id", async () => {
                const shipping = await createNewShipping({})

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", shipping.userId)
                    .set("x-access-token", generateAccessToken(shipping.userId));

                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(200);
            });

            it("should return the expected shipping when querying with exiting user id", async () => {
                const shipping = await createNewShipping({})

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", shipping.userId)
                    .set("x-access-token", generateAccessToken(shipping.userId));

                const shippingResponse = result.body.data[0]
                delete shipping.country
                expect(shippingResponse).toMatchObject(shipping)
            });

            it("should return all the related shippings to the same user id", async () => {
                const userId = await createNewUser({})
                const firstShipping = await createNewShipping({ userId })
                const secondShipping = await createNewShipping({ userId })

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId));

                expect(result.body.data).toHaveLength(2)
            });

            it("should return no shippings when querying user that has no shipping", async () => {
                const userId = await createNewUser({})

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId));

                expect(result.status).toBe(200);

                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(0);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(200);
            });
        })

        describe("get specific shipping by shippipng id", () => {
            it("should return succeed retrieving shipping when querying with exiting shipping id", async () => {
                const shipping = await createNewShipping({})

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", shipping.userId)
                    .set("shippingId", shipping.id)
                    .set("x-access-token", generateAccessToken(shipping.userId));

                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(200);
            });

            it("should return the expected shipping when querying with exiting shipping id", async () => {
                const shipping = await createNewShipping({})

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", shipping.userId)
                    .set("shippingId", shipping.id)
                    .set("x-access-token", generateAccessToken(shipping.userId));

                const shippingResponse = result.body.data[0]
                delete shipping.country
                expect(shippingResponse).toMatchObject(shipping)
            });

            it("should return 400 when querying with non-exiting shipping id", async () => {
                const userId = await createNewUser({})
                const shippingId = "52907745-7672-470e-a803-a2f8feb5294"

                const result = await request(app)
                    .get(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("shippingId", shippingId)
                    .set("x-access-token", generateAccessToken(userId))

                expect(result.status).toBe(400);

                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(0);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1063);

            })
        })
    })

    describe("PUT", () => {

        it("should only update the modified fields", async () => {

            const shipping = await createNewShipping({
                forename: testForename,
                surname: testSurname,
            })

            const updateShippingRequest: PutShippingRequest = {
                id: shipping.id,
                forename: "Rachel",
                surname: "Smith",
            }
            const result = await request(app)
                .put(SHIPPING_ROUTE)
                .set("id", shipping.userId)
                .set("x-access-token", generateAccessToken(shipping.userId))
                .send(updateShippingRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const shippingResponse: ShippingResponse = result.body.data[0]
            expect(shippingResponse).toMatchObject({
                forename: "Rachel",
                surname: "Smith"
            })
        })

        it("should update the audit timestamp in audit table", async () => {
            const newShipping = await createNewShipping({
                forename: testForename,
                surname: testSurname,
            })
            const initialAudit = await db.GetUsersAuditAll(newShipping.userId)

            const updateShippingRequest: PutShippingRequest = {
                id: newShipping.id,
                company: testCompany,
                country: testCountry,
                zip: testZip,
                city: testCity,
                box: testBox,
            }
            await waitSeconds(1);

            await request(app)
                .put(SHIPPING_ROUTE)
                .set("id", newShipping.userId)
                .set("x-access-token", generateAccessToken(newShipping.userId))
                .send(updateShippingRequest);

            const audit = await db.GetUsersAuditAll(newShipping.userId)
            expect(getTime(audit.modified)).toBeGreaterThan(getTime(initialAudit.modified))
            expect(getTime(audit.shipping)).toBeGreaterThan(getTime(initialAudit.shipping))

            function getTime(timestamp: string): number {
                return new Date(timestamp).getTime();
            }

            function waitSeconds(seconds: number): Promise<void> {
                return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            }
        })

        it("should return 400 when querying with non-exiting shipping id", async () => {
            const userId = await createNewUser({})

            const updateShippingRequest: PutShippingRequest = {
                id: "52907745-7672-470e-a803-a2f8feb5294",
                forename: "Rachel",
                surname: "Smith",
            }
            const result = await request(app)
                .put(SHIPPING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId))
                .send(updateShippingRequest);

            expect(result.status).toBe(400);

            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(0);

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(1063);

        })

    })

    describe("POST", () => {
        it("should create shipping and return shipping response", async () => {
            const userId = await createNewUser({})
            const shippingRequest: PostShippingRequest = {
                name: "shipping name",
                userId: userId,
                shippingType: ShippingType.ADDRESS,
                company: testCompany,
                forename: testForename,
                surname: testSurname,
                zip: testZip,
                city: testCity,
                state: testState,
                street: testStreet,
                streetNumber: testStreetNumber,
                country: testCountry
            }
            const result = await request(app)
                .post(SHIPPING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId))
                .send(shippingRequest);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("data");
            expect(result.body.data).toHaveLength(1);

            expect(result.body).toHaveProperty("code");
            expect(result.body.code).toBe(200);

            const shippingResponse: ShippingResponse = result.body.data[0]
            const allCountries = new Country();
            const usa = allCountries.getCountryByISO3("USA")
            delete shippingRequest.country
            expect(shippingResponse).toMatchObject({
                    ...shippingRequest,
                    countryISO2: usa.iso2,
                    countryISO3: usa.iso3,
                    countryName: usa.name
                }
            )
        })

        it("should update the audit timestamp in audit table when creating new shipping", async () => {
            const userId = await createNewUser({})
            const initialAudit = await db.GetUsersAuditAll(userId)

            const shippingRequest: PostShippingRequest = {
                name: "shipping name",
                userId: userId,
                shippingType: ShippingType.ADDRESS,
                company: testCompany,
                forename: testForename,
                surname: testSurname,
                zip: testZip,
                city: testCity,
                state: testState,
                street: testStreet,
                streetNumber: testStreetNumber,
                country: testCountry
            }
            await waitSeconds(1);

            await request(app)
                .post(SHIPPING_ROUTE)
                .set("id", userId)
                .set("x-access-token", generateAccessToken(userId))
                .send(shippingRequest);

            const audit = await db.GetUsersAuditAll(userId)
            expect(getTime(audit.modified)).toBeGreaterThan(getTime(initialAudit.modified))
            expect(getTime(audit.shipping)).toBeGreaterThan(getTime(initialAudit.shipping))

            function getTime(timestamp: string): number {
                return new Date(timestamp).getTime();
            }

            function waitSeconds(seconds: number): Promise<void> {
                return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
            }
        })


        describe("optional values validations", () => {
            it("should return error when shipping type is address and address fields are missing", async () => {
                const userId = await createNewUser({})
                const shippingRequest: PostShippingRequest = {
                    name: "shipping name",
                    userId: userId,
                    shippingType: ShippingType.ADDRESS
                }

                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(0);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1102);
                expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: zip,city and county are required when using address shipping method");
            })
            it("should return error when shipping type is packstation and packstation fields are missing", async () => {
                const userId = await createNewUser({})
                const shippingRequest: PostShippingRequest = {
                    name: "shipping name",
                    userId: userId,
                    shippingType: ShippingType.PACKSTATION
                }

                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(0);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1102);
                expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: packstation and postnumber are required when using packstation shipping method");
            })

            it("should create shipping when packstation is  provided even when address fields are missing", async () => {
                const userId = await createNewUser({})
                const shippingRequest: PostShippingRequest = {
                    name: "shipping name",
                    userId: userId,
                    shippingType: ShippingType.PACKSTATION,
                    packstation: testPackstation,
                    postnumber: testPostnumber
                }

                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(200);
            })
            it("should create shipping when address fields are provided even when packstation fields are missing", async () => {
                const userId = await createNewUser({})
                const shippingRequest: PostShippingRequest = {
                    name: "shipping name",
                    userId: userId,
                    shippingType: ShippingType.ADDRESS,
                    company: testCompany,
                    forename: testForename,
                    surname: testSurname,
                    zip: testZip,
                    city: testCity,
                    state: testState,
                    street: testStreet,
                    streetNumber: testStreetNumber,
                    country: testCountry
                }

                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(200);
            })

            describe("shipping address validation", () => {
                describe("company, forename and surname validation", () => {
                    it("should return error when creating shipping with both company and forename + surname missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            box: testBox,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(400);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(0);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(1102);
                        expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: either company, or forename + surname are required");
                    })

                    it("should create shipping when company is provided even when forename and surname are missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            box: testBox,
                            company: testCompany,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(200);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(1);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(200);
                    })

                    it("should create shipping when forename + surname are provided even when company is missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            box: testBox,
                            forename: testForename,
                            surname: testSurname,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(200);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(1);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(200);
                    })
                })
                describe("box, state, street and street number validation", () => {
                    it("should return error when creating shipping with both box and state + street + street number missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            company: testCompany,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(400);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(0);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(1102);
                        expect(JSON.parse(result.text).message).toBe("It seems, that you provided an an invalid combination of fields in request body: either box, or state, street and street number are required");
                    })

                    it("should create shipping when box is provided even when state + street + street number are missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            company: testCompany,
                            box: testBox,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(200);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(1);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(200);
                    })

                    it("should create shipping when state + street + street number provided even when box is missing", async () => {
                        const userId = await createNewUser({})
                        const shippingRequest: PostShippingRequest = {
                            name: "shipping name",
                            userId: userId,
                            shippingType: ShippingType.ADDRESS,
                            country: testCountry,
                            zip: testZip,
                            city: testCity,
                            company: testCompany,
                            state: testState,
                            street: testStreet,
                            streetNumber: testStreetNumber,
                        }

                        const result = await request(app)
                            .post(SHIPPING_ROUTE)
                            .set("id", userId)
                            .set("x-access-token", generateAccessToken(userId))
                            .send(shippingRequest);

                        expect(result.status).toBe(200);
                        expect(result.body).toHaveProperty("data");
                        expect(result.body.data).toHaveLength(1);

                        expect(result.body).toHaveProperty("code");
                        expect(result.body.code).toBe(200);
                    })
                })
            })


        })
        describe("min and max length validations", () => {
            it("should return error when creating shipping with shipping name length over 50 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "x".repeat(51),
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    company: testCompany,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with shipping name length under 1 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    company: testCompany,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with company length over 150 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    company: "x".repeat(151),
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with forename length over 100 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: "x".repeat(101),
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with surname length over 100 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: "x".repeat(101),
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with zip length over 20 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: "x".repeat(21),
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with zip length under 1 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: "",
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with city length over 50 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: "x".repeat(51),
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with city length under 1 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: "",
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with state length over 50 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    state: "x".repeat(51),
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with box length over 50 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: "x".repeat(51),
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with street length over 150 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    street: "x".repeat(151),
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with streetNumber length over 20 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: testCountry,
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                    streetNumber: "x".repeat(21),
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with country length over 3 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: "ABCD",
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with country length under 2 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.ADDRESS,
                    country: "A",
                    zip: testZip,
                    city: testCity,
                    forename: testForename,
                    surname: testSurname,
                    box: testBox,
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with packstation length over 5 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.PACKSTATION,
                    packstation: "789568",
                    postnumber: testPostnumber
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with packstation length under 2 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.PACKSTATION,
                    packstation: "7",
                    postnumber: testPostnumber
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with postnumber length over 15 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.PACKSTATION,
                    packstation: testPackstation,
                    postnumber: "x".repeat(16)
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })

            it("should return error when creating shipping with postnumber length under 1 chars", async () => {
                const userId = await createNewUser({})

                const shippingRequest: PostShippingRequest = {
                    userId: userId,
                    name: "shipping name",
                    shippingType: ShippingType.PACKSTATION,
                    packstation: testPackstation,
                    postnumber: ""
                }
                const result = await request(app)
                    .post(SHIPPING_ROUTE)
                    .set("id", userId)
                    .set("x-access-token", generateAccessToken(userId))
                    .send(shippingRequest);

                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("data");
                expect(result.body.data).toHaveLength(1);

                expect(result.body).toHaveProperty("code");
                expect(result.body.code).toBe(1101);
            })
        })

    })

})
