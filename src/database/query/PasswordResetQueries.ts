import { ClippicDataSource } from "../DatabaseConnection";
import { Repository } from "typeorm";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { UsersPasswordReset } from "../entity/UsersPasswordReset";

export class PasswordResetQueries {
    private passwordResetRepository: Repository<UsersPasswordReset>;
    private parentSpanContext: SpanContext;

    constructor(parentSpanContext?: SpanContext) {
        this.passwordResetRepository = ClippicDataSource.getRepository(UsersPasswordReset);
        this.parentSpanContext = parentSpanContext;
    }

    @trace
    SetPasswordForgottenSecret(id: string, secret: number) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(UsersPasswordReset)
            .values({
                userId: id,
                created: () => "CURRENT_TIMESTAMP",
                expired: () => "DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)",
                secret: secret,
                used: false
            })
            .orUpdate(["created", "expired", "secret", "used"])
            .execute();
    }

    @trace
    GetPasswordReset(id: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .from(UsersPasswordReset, "users_password_reset")
            .select("users_password_reset.expired")
            .addSelect("users_password_reset.created")
            .addSelect("users_password_reset.secret")
            .addSelect("users_password_reset.used")
            .where("users_password_reset.userId = :id", { id: id })
            .getOne();
    }

}
