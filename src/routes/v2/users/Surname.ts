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
import { AuditQueries } from "../../../database/query/AuditQueries";
import { GetSurnameResponse } from "../../../models/surname/GetSurnameResponse";
import { PutSurnameRequest } from "../../../models/surname/PutSurnameRequest";
import { PutSurnameResponse } from "../../../models/surname/PutSurnameResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

@Route("/v2/users/surname")
export class SurnameController extends Controller {

    public router = express.Router();

    private req: RequestTracing;
    private traceId: string;
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private parentSpanContext: SpanContext;
    private user: User = {};

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersSurname() {
        const result = await this.usersQueries.GetSurname(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateSurname(surname: string) {
        await this.usersQueries.UpdateSurname(this.user.id, surname);
    }

    private async updateModified() {
        await this.auditQueries.UpdateAuditSurname(this.user.id);
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
        this.auditQueries = new AuditQueries(this.parentSpanContext);

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
