import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken,
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { PutUsernameRequest } from "../../../models/username/PutUsernameRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsernameAlreadyExistsError } from "@clippic/clippic-errors";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class UsernameLogic {

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

    public async getUsersUsernameLogic() {
        await this.checkRouteAccess();
        await this.getUsersUsername();
        return this.user.username;
    }

    public async updateUsersUsername(body: PutUsernameRequest): Promise<string> {
        await this.checkRouteAccess();
        if (this.user.username != body.username) {

            if (await this.CheckIfUsernameAlreadyExists(body.username)) {
                throw new UsernameAlreadyExistsError(body.username, this.traceId);
            }

            await Promise.all([
                this.updateUsername(body.username),
                this.updateModified()
            ]);
        }
        return body.username;
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersUsername() {
        const result = await this.usersQueries.GetUsername(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async CheckIfUsernameAlreadyExists(username: string): Promise<boolean> {
        return await this.usersQueries.CheckIfUsernameAlreadyExists(username) > 0;
    }

    private async updateUsername(username: string) {
        await this.usersQueries.UpdateUsername(this.user.id, username);
    }

    private async updateModified() {
        await this.auditQueries.UpdateAuditUsername(this.user.id);
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

}
