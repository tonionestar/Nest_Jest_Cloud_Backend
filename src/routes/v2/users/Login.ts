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
    SuccessResponse, Tags
} from "tsoa";
import {
    GetAuditError,
    MailFormatError,
    PasswordWrongError,
    UsernameOrMailRequiredError
} from "@clippic/clippic-errors";
import {
    generatePasswordHash,
    getJWTSecret, getTraceContext,
    getTraceId
} from "../../../classes/Common";

import { AccessToken } from "../../../models/AccessToken";
import { PostLoginRequest } from "../../../models/login/PostLoginRequest";
import { PostLoginResponse } from "../../../models/login/PostLoginResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserAudit } from "../../../models/UserAudit";
import { UserQueries } from "../../../database/query/UserQueries";
import { validateEmail } from "../../../classes/Mailer";

@Route("/users/v2/login")
export class LoginController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private body: PostLoginRequest;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private password: string;
    private email: string;
    private username: string;

    private user: User;
    private userAudit: UserAudit;

    private prove: string;
    private token: string;

    private readPassword(): void {
        this.password = this.body.pass;
    }

    private readEmail(): void {
        this.email = this.body.email;
        if (this.email != null) {
            validateEmail(this.email, this.traceId);
        }
    }

    private readUsername(): void {
        this.username = this.body.username;
    }

    private checkPassword() {
        if (this.user.hash !== this.prove) {
            throw new PasswordWrongError(this.traceId);
        }
    }

    private checkRequiredFieldsExists(): void  {
        if ((this.email === undefined && this.username === undefined) || (this.email !== undefined && this.username !== undefined)) {
            throw new UsernameOrMailRequiredError(this.traceId);
        }
    }

    private checkIfUserExists(): void {
        if (this.user == undefined) {
            throw new PasswordWrongError(this.traceId);
        }
    }

    private async getUsersAudit() {
        this.userAudit = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersAudit, this.user.id);
        if (this.userAudit == null) {
            throw new GetAuditError(this.traceId)
        }
    }

    private generateAccessToken() {
        const accessToken: AccessToken = {
            userId: this.user.id.toString(),
            session: this.user.session.toString()
        }
        this.token = jwt.sign(accessToken, getJWTSecret(), {});
    }

    /**
     * This request will login a user and return a JWT Token.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | MailFormatError             |
     * | 400  | UsernameOrMailRequiredError |
     * | 400  | PasswordWrongError          |
     * | 400  | GetAuditError               |
     */
    @Tags("Login")
    @Response<MailFormatError>(400)
    @Response<UsernameOrMailRequiredError>(400)
    @Response<PasswordWrongError>(400)
    @Response<GetAuditError>(400)
    @Example<PostLoginResponse>({
        status: "success",
        message: "Login succeeded",
        data: [
            {
                "created": "2021-01-09T21:40:37.000Z",
                "id": "52907745-7672-470e-a803-a2f8feb52944",
                "lastModified": "2021-04-26T14:57:18.000Z",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @SuccessResponse(200, "Login succeeded")
    @Post("/")
    public async login (@Request() req: RequestTracing, @Body() body: PostLoginRequest): Promise<PostLoginResponse> {
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.body = body;

        this.readPassword();
        this.readEmail();
        this.readUsername();

        this.checkRequiredFieldsExists();

        if (this.email !== undefined) {
            this.user = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersInformationByEMail, this.email);
        } else {
            this.user = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersInformationByUsername, this.username);
        }

        this.checkIfUserExists();

        // Get Audit
        await this.getUsersAudit();

        // Generate a password hash by users password
        this.prove = generatePasswordHash(this.password, this.user.salt);

        this.generateAccessToken();

        this.checkPassword();

        return Promise.resolve({
            "status": "success",
            "message": "Login succeeded",
            "data": [{
                "created": this.userAudit.created,
                "id": this.user.id,
                "lastModified": this.userAudit.modified,
                "token": this.token,
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
