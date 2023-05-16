import {
    checkJWTAuthenticationSession,
    generateSession,
    getUserIdFromJWTToken,
    validatePassword
} from "../../../classes/Common";
import { AuditQueries } from "../../../database/query/AuditQueries";
import crypto from "crypto";
import { Mailer } from "../../../classes/Mailer";
import { PasswordResetQueries } from "../../../database/query/PasswordResetQueries";
import { PutPasswordRequest } from "../../../models/password/PutPasswordRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class PasswordLogic {
    public mailer = new Mailer();
    private passwordQueries: PasswordResetQueries;
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private req: RequestTracing;
    private traceId: string;

    private user: User = {};

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.passwordQueries = new PasswordResetQueries(parentSpanContext);
    }

    public async changePasswordLogic(body: PutPasswordRequest) {
        await this.checkRouteAccess();
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
    }

    public async forgotPasswordLogic(email:string) {
        this.user.email = email;
        await this.getUsersID();

        // Only continue when user exists.
        // Return success response as well to avoid email lookups by spammers
        if (this.user.id !== undefined) {
            const secret = await this.setPasswordForgottenSecret();
            await this.sendPasswordForgottenMail(secret);
        }

    }

    private async getUsersSalt() {
        const result = await this.usersQueries.GetUsersSalt(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersID() {
        const result = await this.usersQueries.GetUsersInformationByEMail(this.user.email);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersEmail() {
        const result = await this.usersQueries.GetEmail(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async setPasswordForgottenSecret() {
        const secret: number = crypto.randomInt(100000, 999999);
        await this.passwordQueries.SetPasswordForgottenSecret(this.user.id, secret);
        return secret;
    }

    private async updateUsersSession() {
        this.generateSession();
        await this.usersQueries.UpdateSession(this.user.id, this.user.session);
    }

    private async updateUsersPassword(pass: string) {
        const hash = crypto.pbkdf2Sync(pass, this.user.salt, 1000, 64, "sha512").toString("hex");
        await this.usersQueries.UpdateHash(this.user.id, hash);
    }

    private async updateUsersAudit() {
        await this.auditQueries.UpdateAuditHash(this.user.id);
    }

    // functions

    private async checkRouteAccess() {
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
}
