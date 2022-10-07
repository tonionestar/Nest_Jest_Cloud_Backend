import * as express from "express";
import { SpanContext } from "opentracing";
import {
    Controller,
    Example,
    Get, Header, Query,
    Request,
    Route,
    Security,
    Tags,
    Response
} from "tsoa";

import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { UserQueries } from "../../../database/query/UserQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { User } from "../../../models/User";
import {GetIdResponse} from "../../../models/GetIdResponse";
import {UserMailNotFoundError} from "../../../../../clippic-errors";

@Route("/users/v2/id")
export class IdController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};

    private async getUsersSalt() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSalt, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getIdByEmail(email: string): Promise<User> {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetIdByEmail, email);
        if (result === null) {
            throw new UserMailNotFoundError(email, this.traceId);
        }
        const searchedUserEmail: User = {};
        return Object.assign(searchedUserEmail, result);
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get salt from database
        await this.getUsersSalt();

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
