import * as jwt from "jsonwebtoken";

import { AccessToken } from "../../src/models/AccessToken";
import { ClippicDataSource } from "../../src/database/DatabaseConnection";
import Country from "../../src/classes/Country";
import { getJWTSecret } from "../../src/classes/Common";
import { User } from "../../src/models/User";
import { Users } from "../../src/database/entity/Users";
import { UsersAudit } from "../../src/database/entity/UsersAudit";
import { UsersBilling } from "../../src/database/entity/UsersBilling";
import { UsersQuota } from "../../src/database/entity/UsersQuota";
import { UsersShipping } from "../../src/database/entity/UsersShipping";

export const testUsername = "tester";
export const testEmail = "tester@clippic.app";
export const testSalt = "3f044014c4b85d9dea5c595a87497da8";
export const testSession = "3f044014c4b85d9dea5c595a87497da8";
export const testHash =
    "3d5e381ad0eab4871413523de5a591c0c939c6c9358edfb53a2155f872f779cc2f04730dfa3971b5101f177f90caf7e66fa6b04c62a7c3b507f2cae4e4030a1d";
export const testForename = "Mr";
export const testSurname = "Tester";
export const testPassword = "Test1234#";
export const testCompany = "Example Corp Inc";
export const testZip = "1234";
export const testCity = "LA";
export const testState = "California";
export const testBox = "PO Box 5";
export const testStreet = "Arbitrary Steet";
export const testStreetNumber = "230a";
export const testCountry = "USA";

export const testUsedSpace = 300;
export const testTotalSpace = 6000000;

export const testNotEnoughRequestSpace = 5999990;
export const testEnoughRequestSpace = 200;

export const testSize = 200;
export const testReducingSize = -300;
export const testValidSize1 = 6000000;
export const testValidSize2 = -400;

export const testManageTotalValidSize = -900000;

export const testPackstation = "5553";
export const testPostnumber = "534598745874";

export async function createNewUser({
    username = testUsername,
    email = testEmail,
    salt = testSalt,
    session = testSession,
    hash = testHash,
    forename = testForename,
    surname = testSurname,
}: User): Promise<string> {
    const insert = await insertUser(
        username,
        email,
        salt,
        session,
        hash,
        forename,
        surname
    );

    const userId = insert.identifiers[0].id;
    await insertAudit(userId);

    return userId;
}

export async function createNewBilling({
    company,
    forename,
    surname,
    zip,
    city,
    state,
    box,
    street,
    streetNumber,
    country,
}: Partial<UsersBilling>): Promise<string> {
    const userId = await createNewUser({});
    const allCountries = new Country();
    const usaId = allCountries.getIDFromISO3("USA");
    const newBilling: UsersBilling = {
        userId,
        company,
        forename,
        surname,
        zip,
        city,
        state,
        box,
        street,
        streetNumber,
        country: country || usaId,
    };

    const BillingRepository = ClippicDataSource.getRepository(UsersBilling);
    await BillingRepository.save(newBilling);
    return newBilling.userId;
}

export async function createNewQuota({
    usedSpace,
    totalSpace,
}: Partial<UsersQuota>): Promise<string> {
    const userId = await createNewUser({});
    const newQuota: UsersQuota = {
        userId,
        usedSpace,
        totalSpace
    };

    const QuotaRepository = ClippicDataSource.getRepository(UsersQuota);
    await QuotaRepository.save(newQuota);
    return newQuota.userId;
}

export async function createNewShipping({
    userId,
    name,
    shippingType,
    company,
    forename,
    surname,
    zip,
    city,
    state,
    box,
    street,
    streetNumber,
    country,
}: Partial<UsersShipping>): Promise<UsersShipping> {
    userId = userId || (await createNewUser({}));
    const allCountries = new Country();
    const usaId = allCountries.getIDFromISO3("USA");

    const newShipping: Partial<UsersShipping> = {
        userId,
        name,
        shippingType,
        company,
        forename,
        surname,
        zip,
        city,
        state,
        box,
        street,
        streetNumber,
        country: country || usaId,
    };

    const ShippingRepository = ClippicDataSource.getRepository(UsersShipping);
    return ShippingRepository.save(newShipping);
}

export async function insertUser(
    username: string,
    email: string,
    salt: string,
    session: string,
    hash: string,
    forename: string,
    surname: string
) {
    return await ClippicDataSource.createQueryBuilder()
        .insert()
        .into(Users)
        .values({
            username: username,
            email: email,
            salt: salt,
            session: session,
            hash: hash,
            forename: forename,
            surname: surname,
        })
        .execute();
}

export function generateAccessToken(
    userId: string,
    session: string = testSession
): string {
    const accessToken: AccessToken = {
        userId: userId,
        session: session,
    };
    return jwt.sign(accessToken, getJWTSecret(), {});
}

export async function insertAudit(userId: string) {
    await ClippicDataSource.createQueryBuilder()
        .insert()
        .into(UsersAudit)
        .values({
            userId: userId,
            created: "CURRENT_TIMESTAMP",
            modified: "CURRENT_TIMESTAMP",
        })
        .execute();
}
