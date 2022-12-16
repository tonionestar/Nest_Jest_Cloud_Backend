import * as express from "express";
import {
    AccountAlreadyExistsError,
    MailFormatError
} from "@clippic/clippic-errors";
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
import { GetEmailResponse } from "../../../models/email/GetEmailResponse";
import { PutEmailRequest } from "../../../models/email/PutEmailRequest";
import { PutEmailResponse } from "../../../models/email/PutEmailResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";
import { validateEmail } from "../../../classes/Mailer";

@Route("/v2/users/email")
export class EmailController extends Controller {

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

    private async getUsersEmail() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetEmail, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async CheckIfEmailAlreadyExists(email: string): Promise<boolean> {
        return await this.db.doQuery(this.parentSpanContext, this.db.CheckIfEmailAlreadyExists, email);
    }

    private async updateEmail(email: string) {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateEmail, this.user.id, email);
    }

    private async updateModified() {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditEmail, this.user.id);
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
     * This request will return the user's Email.
     */
    @Tags("Email")
    @Example<GetEmailResponse>({
        status: "success",
        message: "",
        data: [
            {
                "email": "test@clippic.app"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getEmailRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetEmailResponse> {
        await this.initialize(req, id);

        await this.getUsersEmail();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "email": this.user.email
            }],
            "code": 200,
            "trace": this.traceId
        });
    }

    /**
     * This request will update the user's email.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | AccountAlreadyExistsError   |
     * | 400  | MailFormatError             |
     */
    @Tags("Email")
    @Example<PutEmailResponse>({
        status: "success",
        message: "",
        data: [
            {
                "email": "testnew@clippic.app"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Response<AccountAlreadyExistsError>(400)
    @Response<MailFormatError>(400)
    @Security("jwt")
    @Put("/")
    public async putEmailRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutEmailRequest): Promise<PutEmailResponse> {
        await this.initialize(req, id);

        validateEmail(body.email, this.traceId);

        await this.getUsersEmail();

        if (this.user.email != body.email) {

            if (await this.CheckIfEmailAlreadyExists(body.email)) {
                throw new AccountAlreadyExistsError(body.email, this.traceId);
            }

            await Promise.all([
                this.updateEmail(body.email),
                this.updateModified()
            ]);
        }

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "email": body.email
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
