import * as jwt from "jsonwebtoken";
import Country from "../../src/classes/Country";
import { UsersBilling } from "../../src/database/entity/UsersBilling";
import { AccessToken } from "../../src/models/AccessToken";
import { ClippicDataSource } from "../../src/database/DatabaseConnection";
import { User } from "../../src/models/User";
import { Users } from "../../src/database/entity/Users";
import { UsersAudit } from "../../src/database/entity/UsersAudit";
import { getJWTSecret } from "../../src/classes/Common";

export const testUsername = "tester";
export const testEmail = "tester@clippic.app";
export const testSalt = "3f044014c4b85d9dea5c595a87497da8";
export const testSession = "3f044014c4b85d9dea5c595a87497da8";
export const testHash = "3d5e381ad0eab4871413523de5a591c0c939c6c9358edfb53a2155f872f779cc2f04730dfa3971b5101f177f90caf7e66fa6b04c62a7c3b507f2cae4e4030a1d";
export const testForename = "Mr";
export const testSurname = "Tester";
export const testPassword = "Test1234#"
export const testCompany = "Example Corp Inc"
export const testZip = "1234"
export const testCity = "LA"
export const testState = "California"
export const testBox = "PO Box 5"
export const testStreet = "Arbitrary Steet"
export const testStreetNumber = "230a"
export const testCountry = "USA"

export async function createNewUser({
                                        username = testUsername,
                                        email = testEmail,
                                        salt = testSalt,
                                        session = testSession,
                                        hash = testHash,
                                        forename = testForename,
                                        surname = testSurname
                                    }: User): Promise<string> {
    const insert = await insertUser(username, email, salt, session, hash, forename, surname);

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
                                           country
                                       }: Partial<UsersBilling>): Promise<string> {
    const userId = await createNewUser({})
    const allCountries = new Country();
    const usaId = allCountries.getIDFromISO3("USA")
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
        country: country || usaId
    }

    const BillingRepository = ClippicDataSource.getRepository(UsersBilling);
    await BillingRepository.save({ ...newBilling })
    return newBilling.userId
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
    return await ClippicDataSource.createQueryBuilder().insert().into(Users).values({
        username: username,
        email: email,
        salt: salt,
        session: session,
        hash: hash,
        forename: forename,
        surname: surname
    }).execute();
}

export function generateAccessToken(userId: string, session: string = testSession): string {
    const accessToken: AccessToken = {
        userId: userId,
        session: session
    }
    return jwt.sign(accessToken, getJWTSecret(), {});
}

export async function insertAudit(userId: string) {
    await ClippicDataSource.createQueryBuilder().insert().into(UsersAudit).values({
        user_id: userId,
        created: "CURRENT_TIMESTAMP",
        modified: "CURRENT_TIMESTAMP"
    }).execute();
}
