import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken,
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { PutSurnameRequest } from "../../../models/surname/PutSurnameRequest";
import { QuotaQueries } from "../../../database/query/QuotaQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class SurnameLogic {
    private req: RequestTracing;
    private traceId: string;
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private quotaQueries: QuotaQueries;
    private user: User = {};

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.quotaQueries = new QuotaQueries(parentSpanContext);
    }

    public async getUsersSurnameLogic(): Promise<string> {
        await this.checkRouteAccess();
        await this.getUsersSurname();
        return this.user.surname;
    }

    public async updateSurnameLogic(body: PutSurnameRequest) {
        await this.getUsersSurname();
        if (this.user.surname != body.surname) {

            await Promise.all([
                this.updateSurname(body.surname),
                this.updateModified()
            ]);
        }
        return body.surname;
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersSurname() {
        const result = await this.usersQueries.GetSurname(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateSurname(surname: string) {
        await this.usersQueries.UpdateSurname(this.user.id, surname);
    }

    private async updateModified() {
        await this.auditQueries.UpdateAuditSurname(this.user.id);
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }
}
