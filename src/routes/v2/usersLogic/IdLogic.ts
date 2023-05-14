import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserMailNotFoundError } from "@clippic/clippic-errors";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class IdLogic {
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


    public async getIdByEmailLogic(email: string):Promise<string>{
        await this.checkRouteAccess();
        const searchedUser = await this.getIdByEmail(email);
        return searchedUser.id ;
    }

    private async getIdByEmail(email: string): Promise<User> {
        const result = await this.usersQueries.GetIdByEmail(email);
        if (result === null) {
            throw new UserMailNotFoundError(email, this.traceId);
        }
        const searchedUser: User = {};
        return Object.assign(searchedUser, result);
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }
}
