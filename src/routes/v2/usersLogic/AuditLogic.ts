import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken,
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserAudit } from "../../../models/UserAudit";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class AuditLogic {
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private req: RequestTracing;
    private traceId: string;

    private user: User = {};
    private userAudit: UserAudit;

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
    }

    public async getUsersAuditLogic(): Promise<UserAudit> {
        await this.checkRouteAccess();
        await this.getUsersAudit();
        return this.userAudit;
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersAudit() {
        const result = await this.auditQueries.GetUsersAuditAll(this.user.id);
        this.userAudit = Object.assign(result);
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }
}
