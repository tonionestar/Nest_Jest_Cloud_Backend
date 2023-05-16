import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken,
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { PutForenameRequest } from "../../../models/forename/PutForenameRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class ForenameLogic {
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

    public async getForenameLogic(): Promise<string> {
        await this.checkRouteAccess();

        await this.getUsersForename();
        return this.user.forename;
    }

    public async putForenameLogic(body: PutForenameRequest): Promise<string> {
        await this.checkRouteAccess();

        await this.getUsersForename();

        if (this.user.forename != body.forename) {
            await this.updateForename(body.forename);
            await this.updateModified();
        }
        return body.forename;
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersForename() {
        const result = await this.usersQueries.GetForename(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateForename(forename: string) {
        await this.usersQueries.UpdateForename(this.user.id, forename);
    }

    private async updateModified() {
        await this.auditQueries.UpdateAuditForename(this.user.id);
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }
}
