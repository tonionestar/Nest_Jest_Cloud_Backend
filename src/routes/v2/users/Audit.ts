import * as express from "express";
import {
    Controller,
    Example,
    Get,
    Header,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";

import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { GetAuditResponse } from "../../../models/audit/GetAuditResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserAudit } from "../../../models/UserAudit";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/audit")
export class AuditController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};
    private userAudit: UserAudit;

    private async getUsersSession() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersAudit() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersAuditAll, this.user.id);
        this.userAudit = Object.assign(result);
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async initialize(req: RequestTracing, id: string) {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.id = id;

        await this.checkRouteAccess();
    }

    /**
     * This request will return the user's last modified dates.
     */
    @Tags("Audit")
    @Example<GetAuditResponse>({
        status: "success",
        message: "",
        data: [
            {
                "user_id": "551efd1e-77c1-49a1-9a9b-c7fa15ce6acf",
                "modified": "2022-11-06T11:14:00.000Z",
                "created": "2022-11-06T11:14:00.000Z",
                "username": null,
                "forename": null,
                "surname": null,
                "email": null,
                "hash": null,
                "billing": null,
                "shipping": null,
                "quota": null
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getAuditRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetAuditResponse> {
        await this.initialize(req, id);

        await this.getUsersAudit();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [
                this.userAudit
            ],
            "code": 200,
            "trace": this.traceId
        });
    }

}
