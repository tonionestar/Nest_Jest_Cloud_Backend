import * as crypto from "crypto";
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
    Route, Security,
    SuccessResponse, Tags
} from "tsoa";
import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId, generateSession,
    getTraceContext,
    getTraceId, validatePassword
} from "../../../classes/Common";

import { ClippicResponse } from "../../../models/ClippicResponse";
import { Mailer } from "../../../classes/Mailer";
import { PasswordInvalidError } from "@clippic/clippic-errors";
import { PutPasswordRequest } from "../../../models/password/PutPasswordRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/password")
export class PasswordController extends Controller {

    public router = express.Router();
    public db = new UserQueries();
    public mailer = new Mailer();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};

    // getter

    private async getUsersSalt() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSalt, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersSession() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersID() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersInformationByEMail, this.user.email);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersEmail() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetEmail, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    // setter

    private async setPasswordForgottenSecret() {
        const secret: number = crypto.randomInt(100000, 999999);
        await this.db.doQuery(this.parentSpanContext, this.db.SetPasswordForgottenSecret, this.user.id, secret);
        return secret;
    }

    private async updateUsersSession() {
        this.generateSession();
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateSession, this.user.id, this.user.session);
    }

    private async updateUsersPassword(pass: string) {
        const hash = crypto.pbkdf2Sync(pass, this.user.salt, 1000, 64, "sha512").toString("hex");
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateHash, this.user.id, hash);
    }

    private async updateUsersAudit() {
        await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditHash, this.user.id);
    }

    // functions

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private generateSession() {
        this.user.session = generateSession();
    }

    private async sendPasswordForgottenMail(secret: number) {
        await this.mailer.sendPasswordResetCode(this.user, secret);
    }

    private async sendPasswordChangedMail() {
        await this.mailer.sendPasswordChanged(this.user);
    }

    private async initialize(req: RequestTracing, id: string) {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.id = id;

        await this.checkRouteAccess();
    }

    /**
     * This request will update users password.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | PasswordInvalidError        |
     */
    @Tags("Password")
    @Response<PasswordInvalidError>(400)
    @Example<ClippicResponse>({
        status: "success",
        message: "Password changed successfully",
        data: [],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @SuccessResponse(200, "Password changed successfully")
    @Security("jwt")
    @Put("/")
    public async changePassword(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutPasswordRequest): Promise<ClippicResponse> {
        await this.initialize(req, id);

        validatePassword(body.pass, this.traceId);

        await Promise.all([
            this.getUsersSalt(),
            this.getUsersEmail(),
        ]);

        await Promise.all([
            this.updateUsersSession(),
            this.updateUsersPassword(body.pass),
            this.updateUsersAudit(),
            this.sendPasswordChangedMail(),
        ]);

        return Promise.resolve({
            "status": "success",
            "message": "Password changed successfully",
            "data": [],
            "code": 200,
            "trace": this.traceId
        });
    }

    /**
     * This request will reset passwort after forgotten.
     */
    @Tags("Password")
    @Example<ClippicResponse>({
        status: "success",
        message: "Password reset instructions has been sent if email address is registered.",
        data: [],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @SuccessResponse(200, "Password reset instructions has been sent if email address is registered.")
    @Get("/")
    public async forgotPassword(@Request() req: RequestTracing, @Header() email: string): Promise<ClippicResponse> {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.email = email;

        await this.getUsersID();

        // Only continue when user exists.
        // Return success response as well to avoid email lookups by spammers
        if (this.user.id !== undefined) {
            const secret = await this.setPasswordForgottenSecret();
            await this.sendPasswordForgottenMail(secret);
        }

        return Promise.resolve({
            "status": "success",
            "message": "Password reset instructions has been sent if email address is registered.",
            "data": [],
            "code": 200,
            "trace": this.traceId
        });
    }
}
