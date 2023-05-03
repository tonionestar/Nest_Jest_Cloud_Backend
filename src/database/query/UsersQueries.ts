import { InsertResult, Repository } from "typeorm";
import { ClippicDataSource } from "../DatabaseConnection";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { Users } from "../entity/Users";

export class UsersQueries {
    private usersRepository: Repository<Users>;
    private parentSpanContext: SpanContext = new SpanContext();

    constructor(parentSpanContext?: SpanContext) {
        this.usersRepository = ClippicDataSource.getRepository(Users);
        this.parentSpanContext = parentSpanContext;
    }

    @trace
    InsertNewUser(username: string, email: string, salt: string, hash: string, session: string): Promise<InsertResult> {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values({
                username: username,
                email: email,
                salt: salt,
                hash: hash,
                session: session,
            })
            .returning(
                "id"
            )
            .execute();
    }

    @trace
    GetUsersInformationByEMail(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.id")
            .addSelect("users.username")
            .addSelect("users.email")
            .addSelect("users.forename")
            .addSelect("users.surname")
            .addSelect("users.salt")
            .addSelect("users.session")
            .addSelect("users.hash")
            .where("users.email = :email", { email: email })
            .getOne();
    }

    @trace
    GetUsersInformationByUsername(username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.id")
            .addSelect("users.username")
            .addSelect("users.email")
            .addSelect("users.forename")
            .addSelect("users.surname")
            .addSelect("users.salt")
            .addSelect("users.session")
            .addSelect("users.hash")
            .where("users.username = :username", { username: username })
            .getOne();
    }

    @trace
    GetLoginData(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.salt")
            .addSelect("users.session")
            .addSelect("users.hash")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetSignupData(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.salt")
            .addSelect("users.session")
            .addSelect("users.hash")
            .addSelect("users.email")
            .addSelect("users.username")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetUsername(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.username")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetEmail(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.email")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetForename(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.forename")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetSurname(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.surname")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetUsersSalt(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.salt")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetUsersSession(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.session")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    @trace
    GetIdByEmail(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.id")
            .where("users.email = :email", { email: email })
            .getOne();
    }

    @trace
    CheckIfUsernameAlreadyExists(username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .where("users.username = :username", { username: username })
            .getCount();
    }

    @trace
    CheckIfEmailAlreadyExists(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .where("users.email = :email", { email: email })
            .getCount();
    }

    @trace
    UpdateUsername(userId: string, username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                username: username
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateEmail(userId: string, email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                email: email
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateForename(userId: string, forename: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                forename: forename
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateSurname(userId: string, surname: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                surname: surname
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateSession(userId: string, session: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                session: session
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateHash(userId: string, hash: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                hash: hash
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

}
