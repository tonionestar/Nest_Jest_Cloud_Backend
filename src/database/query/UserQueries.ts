import { Span, SpanContext } from "opentracing";
import tracer from "../../classes/Jaeger";
import { ClippicDataSource } from "../DatabaseConnection";
import { Users } from "../entity/Users";
import { UsersAudit } from "../entity/UsersAudit";


export class UserQueries {

    async doQuery(parentSpanContext: SpanContext, callback: any, ...callbackArgs: string[]) {
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
            .addSelect("users.hash")
            .where("users.username = :username", { username: username })
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

    GetUsername(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.username")
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

    CheckIfUsernameAlreadyExists(username: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .where("users.username = :username", { username: username })
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

    UpdateAudit(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP"
            })
            .where("user_id = :userId", { userId: userId })
            .execute()
    }
}
