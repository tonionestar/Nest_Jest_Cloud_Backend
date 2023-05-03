import { Repository, UpdateResult } from "typeorm";
import { ClippicDataSource } from "../DatabaseConnection";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { UsersAudit } from "../entity/UsersAudit";

export class AuditQueries {
    private auditRepository: Repository<UsersAudit>;
    private parentSpanContext: SpanContext;

    constructor(parentSpanContext?: SpanContext) {
        this.auditRepository = ClippicDataSource.getRepository(UsersAudit);
        this.parentSpanContext = parentSpanContext;
    }

    @trace
    InsertInitialAudit(id: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(UsersAudit)
            .values({
                userId: id,
                created: () => "CURRENT_TIMESTAMP",
                modified: () => "CURRENT_TIMESTAMP",
                username: () => "CURRENT_TIMESTAMP",
                email: () => "CURRENT_TIMESTAMP",
                hash: () => "CURRENT_TIMESTAMP",
                quota: () => "CURRENT_TIMESTAMP",
            })
            .execute();
    }

    @trace
    GetUsersAudit(userId: string) : Promise<Partial<UsersAudit>> {
        return ClippicDataSource.manager
            .createQueryBuilder(UsersAudit, "users_audit")
            .select("users_audit.modified")
            .addSelect("users_audit.created")
            .where("users_audit.userId = :userId", { userId: userId })
            .getOne();
    }

    @trace
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
            .addSelect("users_audit.userId")
            .where("users_audit.userId = :userId", { userId: userId })
            .getOne();
    }

    @trace
    UpdateAuditForename(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                forename: () => "CURRENT_TIMESTAMP"
            })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateAuditSurname(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                surname: () => "CURRENT_TIMESTAMP"
            })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateAuditUsername(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                username: () => "CURRENT_TIMESTAMP"
            })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateAuditEmail(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                email: () => "CURRENT_TIMESTAMP"
            })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateAuditHash(userId: string) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .update(UsersAudit, {
                modified: () => "CURRENT_TIMESTAMP",
                hash: () => "CURRENT_TIMESTAMP"
            })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    @trace
    UpdateAuditBilling(userId: string): Promise<UpdateResult> {
        return this.auditRepository.update(userId, {
            modified: () => "CURRENT_TIMESTAMP",
            billing: () => "CURRENT_TIMESTAMP"
        });
    }

    @trace
    UpdateAuditShipping(userId: string): Promise<UpdateResult> {
        return this.auditRepository.update(userId, {
            modified: () => "CURRENT_TIMESTAMP",
            shipping: () => "CURRENT_TIMESTAMP"
        });
    }

}
