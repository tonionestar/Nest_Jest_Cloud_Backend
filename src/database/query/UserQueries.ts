import { Span, SpanContext } from "opentracing";
import { ClippicDataSource } from "../DatabaseConnection";
import { Users } from "../entity/Users";
import { UsersAudit } from "../entity/UsersAudit";
import { UsersPasswordReset } from "../entity/UsersPasswordReset";
import tracer from "../../classes/Jaeger";

export class UserQueries {

    async doQuery(parentSpanContext: SpanContext, callback: any, ...callbackArgs: any[]) {
        const span: Span = tracer.startSpan(callback.name, {
            childOf: parentSpanContext,
        });
        span.setTag("component", "db");
        const result = await callback(...callbackArgs);
        span.finish();
        return result;
    }

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

    GetLoginData(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.salt")
            .addSelect("users.session")
            .addSelect("users.hash")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetUsersAudit(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(UsersAudit, "users_audit")
            .select("users_audit.modified")
            .addSelect("users_audit.created")
            .where("users_audit.user_id = :userId", { userId: userId })
            .getOne();
    }

    GetUsersAuditAll(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(UsersAudit, "users_audit")
            .select("users_audit.modified")
            .addSelect("users_audit.created")
            .addSelect("users_audit.username")
            .addSelect("users_audit.forename")
            .addSelect("users_audit.surname")
            .addSelect("users_audit.email")
            .addSelect("users_audit.hash")
            .addSelect("users_audit.billing")
            .addSelect("users_audit.shipping")
            .addSelect("users_audit.quota")
            .addSelect("users_audit.user_id")
            .where("users_audit.user_id = :userId", { userId: userId })
            .getOne();
    }

    GetUsername(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.username")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetEmail(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.email")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetForename(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.forename")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetSurname(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.surname")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetUsersSalt(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.salt")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetUsersSession(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.session")
            .where("users.id = :userId", { userId: userId })
            .getOne();
    }

    GetIdByEmail(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.id")
            .where("users.email = :email", { email: email })
            .getOne();
    }

    CheckIfUsernameAlreadyExists(username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .where("users.username = :username", { username: username })
            .getCount()
    }

    CheckIfEmailAlreadyExists(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .where("users.email = :email", { email: email })
            .getCount()
    }

    UpdateUsername(userId: string, username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                username: username
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateEmail(userId: string, email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                email: email
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateForename(userId: string, forename: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                forename: forename
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateSurname(userId: string, surname: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                surname: surname
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateSession(userId: string, session: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                session: session
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateHash(userId: string, hash: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .update(Users, {
                hash: hash
            })
            .where("users.id = :userId", { userId: userId })
            .execute();
    }

    UpdateAuditForename(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                forename: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute();
    }

    UpdateAuditSurname(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                surname: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute()
    }

    UpdateAuditUsername(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                username: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute()
    }

    UpdateAuditEmail(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                email: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute()
    }

    UpdateAuditHash(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                hash: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute()
    }

    SetPasswordForgottenSecret(id: string, secret: number) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(UsersPasswordReset)
            .values({
                user_id: id,
                created: () => "CURRENT_TIMESTAMP",
                expired: () => "DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)",
                secret: secret,
                used: false
            })
            .orUpdate(["created", "expired", "secret", "used"])
            .execute()
    }

    GetPasswordReset(id: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .from(UsersPasswordReset, "users_password_reset")
            .select("users_password_reset.expired")
            .addSelect("users_password_reset.created")
            .addSelect("users_password_reset.secret")
            .addSelect("users_password_reset.used")
            .where("users_password_reset.user_id = :id", { id: id })
            .getOne();
    }
}
