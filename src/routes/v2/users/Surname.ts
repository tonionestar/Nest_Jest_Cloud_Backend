import * as express from "express";
import { SpanContext } from "opentracing";
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
import { UserQueries } from "../../../database/query/UserQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { User } from "../../../models/User";
import { GetSurnameResponse } from "../../../models/surname/GetSurnameResponse";
import { PutSurnameRequest } from "../../../models/surname/PutSurnameRequest";
import { PutSurnameResponse } from "../../../models/surname/PutSurnameResponse";

@Route("/users/v2/surname")
export class SurnameController extends Controller {

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

    private async getUsersSurname() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetSurname, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateSurname(surname: string) {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateSurname, this.user.id, surname);
    }

    private async updateModified() {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditSurname, this.user.id);
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
     * This request will return the user's surname.
     */
    @Tags("Surname")
    @Example<GetSurnameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "surname": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getSurnameRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetSurnameResponse> {
        await this.initialize(req, id);

        await this.getUsersSurname();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "surname": this.user.surname
            }],
            "code": 200,
            "trace": this.traceId
        });
    }

    /**
     * This request will update or create if not exists the user's surname.
     */
    @Tags("Surname")
    @Example<PutSurnameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "surname": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Put("/")
    public async putSurnameRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutSurnameRequest): Promise<PutSurnameResponse> {
        await this.initialize(req, id);

        await this.getUsersSurname();

        if (this.user.surname != body.surname) {

            await Promise.all([
                this.updateSurname(body.surname),
                this.updateModified()
            ]);
        }

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "surname": body.surname
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
