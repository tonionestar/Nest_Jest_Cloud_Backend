import { AuditQueries } from "../../../database/query/AuditQueries";
import { DeleteResult } from "typeorm";
import { getUserIdFromJWTToken } from "../../../classes/Common";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class UsersLogic {

    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;

    private req: RequestTracing;
    private traceId: string;

    private user: User = {};

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
    }

    public deleteUser(): Promise<DeleteResult>{
        return this.usersQueries.DeleteUser(this.user.id);
    }
}
