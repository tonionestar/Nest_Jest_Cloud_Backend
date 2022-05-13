import {ClippicDataSource} from "../DatabaseConnection";
import {Users} from "../entity/Users";


export class UserQueries {

    GetUsersInformationByEMail(email: string) {
        return ClippicDataSource.manager
            .createQueryBuilder(Users, "users")
            .select("users.id")
            .addSelect("users.username")
            .addSelect("users.email")
            .addSelect("users.forename")
            .addSelect("users.surname")
            .where("users.email = :email", {email: email})
            .getOne();
    }
}
