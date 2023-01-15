import * as express from "express";
import * as jwt from "jsonwebtoken";

import {
    Body,
    Controller,
    Example,
    Post,
    Request,
    Response,
    Route,
    SuccessResponse,
    Tags
} from "tsoa";
import {
    AccountAlreadyExistsError,
    IdAlreadyExistsError,
    MailFormatError,
    UsernameAlreadyExistsError,
} from "@clippic/clippic-errors";
import { Mailer,
    validateEmail
} from "../../../classes/Mailer";
import {
    generatePasswordHash,
    generateSalt,
    generateSession,
    getJWTSecret,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";

import { AccessToken } from "../../../models/AccessToken";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { PostSignupRequest } from "../../../models/signup/PostSignupRequest";
import { PostSignupResponse } from "../../../models/signup/PostSignupResponse";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/signup")
export class SignupController extends Controller {

    public router = express.Router();
    public db = new UserQueries();
    public mailer = new Mailer();

    private body: PostSignupRequest;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};

    private token: string;

    private readPassword(): void {
        this.user.salt = generateSalt();
        this.user.hash = generatePasswordHash(this.body.pass, this.user.salt);
        this.user.session = generateSession();
    }

    private readEmail(): void {
        this.user.email = this.body.email;
        validateEmail(this.user.email, this.traceId);
    }

    private readUsername(): void {
        this.user.username = this.body.username;
    }

    private async checkIfEmailExists() {
        if(await this.db.doQuery(this.parentSpanContext, this.db.CheckIfEmailAlreadyExists, this.user.email) > 0) {
            throw new AccountAlreadyExistsError(this.user.email, this.traceId);
        }
    }

    private async checkIfUsernameExists() {
        if(await this.db.doQuery(this.parentSpanContext, this.db.CheckIfUsernameAlreadyExists, this.user.username) > 0) {
            throw new UsernameAlreadyExistsError(this.user.username, this.traceId);
        }
    }
    private async insertNewUser() {
        const result = await this.db.doQuery(
            this.parentSpanContext,
            this.db.InsertNewUser,
            this.user.username,
            this.user.email,
            this.user.salt,
            this.user.hash,
            this.user.session
        );

        this.user.id = result.raw[0].id;
    }

    private async insertUserAdditional() {
        await Promise.all([
            // Audit
            this.db.doQuery(this.parentSpanContext, this.db.InsertInitialAudit, this.user.id),
            // Quota
            this.db.doQuery(this.parentSpanContext, this.db.InsertInitialQuota, this.user.id, 5242880),
        ]);

    }

    private generateAccessToken() {
        const accessToken: AccessToken = {
            userId: this.user.id.toString(),
            session: this.user.session.toString()
        }
        this.token = jwt.sign(accessToken, getJWTSecret(), {});
    }

    private async sendSignupMail() {
        await this.mailer.sendSignup(this.user)
    }

    /**
     * This request will create a new user account.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | MailFormatError             |
     * | 400  | AccountAlreadyExistsError   |
     * | 400  | UsernameAlreadyExistsError  |
     * | 400  | IdAlreadyExistsError        |
     */
    @Tags("Signup")
    @Response<MailFormatError>(400)
    @Response<AccountAlreadyExistsError>(400)
    @Response<UsernameAlreadyExistsError>(400)
    @Response<IdAlreadyExistsError>(400)
    @Example<PostSignupResponse>({
        status: "success",
        message: "Account creation succeeded",
        data: [
            {
                "id": "52907745-7672-470e-a803-a2f8feb52944",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @SuccessResponse(200, "Account creation succeeded")
    @Post("/")
    public async signup (@Request() req: RequestTracing, @Body() body: PostSignupRequest): Promise<PostSignupResponse> {
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.body = body;

        this.readPassword();
        this.readEmail();
        this.readUsername();

        await Promise.all([
            this.checkIfEmailExists(),
            this.checkIfUsernameExists(),
        ]);

        await this.insertNewUser();

        await Promise.all([
            await this.sendSignupMail(),
            await this.insertUserAdditional(),
        ]);

        this.generateAccessToken();

        return Promise.resolve({
            "status": "success",
            "message": "Account creation succeeded",
            "data": [{
                "id": this.user.id,
                "token": this.token,
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
