import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
} from "../../../classes/Common";
import { AccountAlreadyExistsError } from "@clippic/clippic-errors";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { PutEmailRequest } from "../../../models/email/PutEmailRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";
import { validateEmail } from "../../../classes/Mailer";

export class EmailLogic {

    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;

    private req: RequestTracing;
    private traceId: string;

    private user: User = {};
    constructor(req: RequestTracing, id: string, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = id;
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
    }
    public async getEmailLogic(): Promise<string> {
        await this.checkRouteAccess();

        await this.getUsersEmail();
        return this.user.email ;
    }
    public async putEmailLogic(body:PutEmailRequest):Promise<string>{
        await this.checkRouteAccess();
        validateEmail(body.email, this.traceId);

        await this.getUsersEmail();

        if (this.user.email != body.email) {

            if (await this.CheckIfEmailAlreadyExists(body.email)) {
                throw new AccountAlreadyExistsError(body.email, this.traceId);
            }

            await Promise.all([
                this.updateEmail(body.email),
                this.updateModified()
            ]);
        }
        return body.email;
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersEmail() {
        const result = await this.usersQueries.GetEmail(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async CheckIfEmailAlreadyExists(email: string): Promise<boolean> {
        return await this.usersQueries.CheckIfEmailAlreadyExists(email) > 0;
    }

    private async updateEmail(email: string) {
        await this.usersQueries.UpdateEmail(this.user.id, email);
    }

    private async updateModified() {
        await this.auditQueries.UpdateAuditEmail(this.user.id);
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }
}
