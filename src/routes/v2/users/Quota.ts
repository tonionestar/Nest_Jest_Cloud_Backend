import * as express from "express";

import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
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

import { GetQuotaResponse } from "../../../models/quota/GetQuotaResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";
import { UserQuota } from "../../../models/UserQuota";

@Route("/v2/users/quota")
export class QuotaController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};
    private userQuota: UserQuota;

    private async getUsersSession() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = { ...result };
    }

    private async getUsersQuota() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersQuotaAll, this.user.id);
        // this.userQuota = Object.assign(result);
        this.userQuota = { ...result };
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
    @Tags("Quota")
    @Example<GetQuotaResponse>({
        status: "success",
        message: "",
        data: [{
            "userId": "551efd1e-77c1-49a1-9a9b-c7fa15ce6acf",
            "usedSpace": 300,
            "totalSpace": 700,
        }],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getQuotaRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetQuotaResponse> {
        await this.initialize(req, id);

        await this.getUsersQuota();

        return {
            "status": "success",
            "message": "",
            "data": [
                this.userQuota
            ],
            "code": 200,
            "trace": this.traceId
        };
    }
}
