import * as express from "express";

import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Put,
    Request,
    Response,
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

import { GetUsernameResponse } from "../../../models/username/GetUsernameResponse";
import { PutUsernameRequest } from "../../../models/username/PutUsernameRequest";
import { PutUsernameResponse } from "../../../models/username/PutUsernameResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsernameAlreadyExistsError } from "@clippic/clippic-errors";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/username")
export class UsernameController extends Controller {

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

    private async getUsersUsername() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsername, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async CheckIfUsernameAlreadyExists(username: string): Promise<boolean> {
        return await this.db.doQuery(this.parentSpanContext, this.db.CheckIfUsernameAlreadyExists, username);
    }

    private async updateUsername(username: string) {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateUsername, this.user.id, username);
    }

    private async updateModified() {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditUsername, this.user.id);
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
     * This request will return the user's username.
     */
    @Tags("Username")
    @Example<GetUsernameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "username": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getUsernameRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetUsernameResponse> {
        await this.initialize(req, id);

        await this.getUsersUsername();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "username": this.user.username
            }],
            "code": 200,
            "trace": this.traceId
        });
    }

    /**
     * This request will update or create if not exists the user's username.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | UsernameAlreadyExistsError  |
     */
    @Tags("Username")
    @Example<PutUsernameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "username": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Response<UsernameAlreadyExistsError>(400)
    @Security("jwt")
    @Put("/")
    public async putUsernameRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutUsernameRequest): Promise<PutUsernameResponse> {
        await this.initialize(req, id);

        await this.getUsersUsername();

        if (this.user.username != body.username) {

            if (await this.CheckIfUsernameAlreadyExists(body.username)) {
                throw new UsernameAlreadyExistsError(body.username, this.traceId);
            }

            await Promise.all([
                this.updateUsername(body.username),
                this.updateModified()
            ]);
        }

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "username": body.username
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
