import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { QuotaQueries } from "../../../database/query/QuotaQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQuota } from "../../../models/UserQuota";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class QuotaLogic {

    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private userQuota: UserQuota;
    private quotaQueries: QuotaQueries;

    private req: RequestTracing;
    private traceId: string;

    private user: User = {};

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.quotaQueries = new QuotaQueries(parentSpanContext);

    }

    public async getUserQuotaLogic() :Promise<UserQuota>{
        await this.checkRouteAccess();
        const result = await this.quotaQueries.GetUsersQuotaAll(this.user.id);
        this.userQuota = { ...result };
        return this.userQuota;

    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

}
