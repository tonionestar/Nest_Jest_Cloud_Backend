import {ClippicDataSource} from "../DatabaseConnection";
import {Users} from "../entity/Users";
import {UsersAudit} from "../entity/UsersAudit";


export class UserQueries {

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
            .where("users.email = :email", {email: email})
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
            .where("users.username = :username", {username: username})
            .getOne();
    }

    GetUsersAudit(user_id: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(UsersAudit, "users_audit")
            .select("users_audit.modified")
            .addSelect("users_audit.created")
            .where("users_audit.user_id = :user_id", {user_id: user_id})
            .getOne();
    }
}
