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
    Query,
    Request,
    Response,
    Route,
    Security,
    Tags
} from "tsoa";

import { GetIdResponse } from "../../../models/id/GetIdResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserMailNotFoundError } from "@clippic/clippic-errors";
import { UsersQueries } from "../../../database/query/UsersQueries";

@Route("/v2/users/id")
export class IdController extends Controller {

    public router = express.Router();
    private usersQueries: UsersQueries;

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getIdByEmail(email: string): Promise<User> {
        const result = await this.usersQueries.GetIdByEmail(email);
        if (result === null) {
            throw new UserMailNotFoundError(email, this.traceId);
        }
        const searchedUserEmail: User = {};
        return Object.assign(searchedUserEmail, result);
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
        this.usersQueries = new UsersQueries(this.parentSpanContext);

        await this.checkRouteAccess();
    }

    /**
     * This request will return the id of any kind of user by its email address. This can not be used to fetch your own
     * user id cause this route requires authorization.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | UserMailNotFoundError       |
     */
    @Tags("Id")
    @Response<UserMailNotFoundError>(400)
    @Example<GetIdResponse>({
        status: "success",
        message: "",
        data: [
            {
                "id": "52907745-7672-470e-a803-a2f8feb52944"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getIdByEMailRequest(@Request() req: RequestTracing, @Header() id: string, @Query() email: string): Promise<GetIdResponse> {
        await this.initialize(req, id);

        const searchedUserEmail: User = await this.getIdByEmail(email);

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "id": searchedUserEmail.id
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
