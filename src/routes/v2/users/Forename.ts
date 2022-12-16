import * as express from "express";
import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Put,
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
import { GetForenameResponse } from "../../../models/forename/GetForenameResponse";
import { PutForenameRequest } from "../../../models/forename/PutForenameRequest";
import { PutForenameResponse } from "../../../models/forename/PutForenameResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/forename")
export class ForenameController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};

    private async getUsersSession() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersForename() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetForename, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateForename(forename: string) {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateForename, this.user.id, forename);
    }

    private async updateModified() {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditForename, this.user.id);
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
     * This request will return the user's forename.
     */
    @Tags("Forename")
    @Example<GetForenameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "forename": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getForenameRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetForenameResponse> {
        await this.initialize(req, id);

        await this.getUsersForename();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "forename": this.user.forename
            }],
            "code": 200,
            "trace": this.traceId
        });
    }

    /**
     * This request will update or create if not exists the user's forename.
     */
    @Tags("Forename")
    @Example<PutForenameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "forename": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Put("/")
    public async putForenameRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutForenameRequest): Promise<PutForenameResponse> {
        await this.initialize(req, id);

        await this.getUsersForename();

        if (this.user.forename != body.forename) {

            await Promise.all([
                this.updateForename(body.forename),
                this.updateModified()
            ]);
        }

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "forename": body.forename
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
