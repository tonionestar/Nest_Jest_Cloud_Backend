import { ClippicDataSource } from "../../src/database/DatabaseConnection";
import { Users } from "../../src/database/entity/Users";
import { UsersAudit } from "../../src/database/entity/UsersAudit";
import {AccessToken} from "../../src/models/AccessToken";
import * as jwt from "jsonwebtoken";
import {getJWTSecret} from "../../src/classes/Common";
import {User} from "../../src/models/User";

export const testUsername = "tester";
export const testEmail = "tester@clippic.app";
export const testSalt = "3f044014c4b85d9dea5c595a87497da8";
export const testHash = "9a7e8f9d70abe0200278298de8866c27393c6455b643c43e809353ffab472decf04e6c91720b0d259d28fd7dae64cc6bd863413b18479240129d586449a21fb9";
export const testForename = "Mr";
export const testSurname = "Tester";

export async function createNewUser({
                                        username = testUsername,
                                        email = testEmail,
                                        salt = testSalt,
                                        hash = testHash,
                                        forename = testForename,
                                        surname = testSurname
                                    }: User): Promise<string> {
    const insert = await insertUser(username, email, salt, hash, forename, surname);

    const userId = insert.identifiers[0].id;
    await insertAudit(userId);

    return userId;
}

export async function insertUser(
    username: string,
    email: string,
    salt: string,
    hash: string,
    forename: string,
    surname: string
) {
    return await ClippicDataSource.createQueryBuilder().insert().into(Users).values({
        username: username,
        email: email,
        salt: salt,
        hash: hash,
        forename: forename,
        surname: surname
    }).execute();
}

export function generateAccessToken(userId: string): string {
    const accessToken: AccessToken = {
        userId: userId,
        session: "3f044014c4b85d9dea5c595a87497da8"
    }
    return jwt.sign(accessToken, getJWTSecret(), {});
}

export async function insertAudit(userId: string) {
    await ClippicDataSource.createQueryBuilder().insert().into(UsersAudit).values({
        user_id: userId,
        created: "CURRENT_TIMESTAMP"
    }).execute();
}
