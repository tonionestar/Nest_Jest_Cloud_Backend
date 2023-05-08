import { ClippicDataSource } from "../DatabaseConnection";
import { Repository } from "typeorm";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { UsersQuota } from "../entity/UsersQuota";

export class QuotaQueries {
    private usersQuotaRepository: Repository<UsersQuota>;
    private parentSpanContext: SpanContext;

    constructor(parentSpanContext?: SpanContext) {
        this.usersQuotaRepository = ClippicDataSource.getRepository(UsersQuota);
        this.parentSpanContext = parentSpanContext;
    }

    @trace
    GetUsersQuotaAll(userId: string): Promise<UsersQuota> {
        const QuotaRepository = ClippicDataSource.getRepository(UsersQuota);
        return QuotaRepository.findOneBy({ userId });
    }

    @trace
    InsertInitialQuota(id: string, quota: number) {
        return ClippicDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(UsersQuota)
            .values({
                userId: id,
                usedSpace: 0,
                totalSpace: quota,
            })
            .execute();
    }

    @trace
    UpdateQuota(userId: string, usedSpace: number, totalSpace: number) {
        return ClippicDataSource.manager
            .createQueryBuilder(UsersQuota, "users_quota")
            .update(UsersQuota, {
                usedSpace: usedSpace,
                totalSpace: totalSpace,
            })
            .where("users_quota.user_id = :userId", { userId: userId })
            .execute();
    }
}
