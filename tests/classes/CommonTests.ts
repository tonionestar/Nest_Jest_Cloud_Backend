import {ClippicDataSource} from "../../src/database/DatabaseConnection";
import {Users} from "../../src/database/entity/Users";
import {UsersAudit} from "../../src/database/entity/UsersAudit";

export async function createNewUser(): Promise<string> {
    const insert = await insertUser();

    const userId = insert.identifiers[0].id;
    await insertAudit(userId);

    return userId;
}

export async function insertUser() {
    return await ClippicDataSource.createQueryBuilder().insert().into(Users).values({
        username: "tester",
        email: "tester@clippic.app",
        salt: "3f044014c4b85d9dea5c595a87497da8",
        hash: "9a7e8f9d70abe0200278298de8866c27393c6455b643c43e809353ffab472decf04e6c91720b0d259d28fd7dae64cc6bd863413b18479240129d586449a21fb9",
        forename: "Mr",
        surname: "Tester"
    }).execute();
}

export async function insertAudit(userId: string) {
    await ClippicDataSource.createQueryBuilder().insert().into(UsersAudit).values({
        user_id: userId,
        created: "CURRENT_TIMESTAMP"
    }).execute();
}
