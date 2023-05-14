import * as jwt from "jsonwebtoken";
import { AccountAlreadyExistsError, UsernameAlreadyExistsError } from "@clippic/clippic-errors";
import { generatePasswordHash, generateSalt, generateSession, getJWTSecret } from "../../../classes/Common";
import { Mailer, validateEmail } from "../../../classes/Mailer";
import { AccessToken } from "../../../models/AccessToken";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { PostSignupRequest } from "../../../models/signup/PostSignupRequest";
import { QuotaQueries } from "../../../database/query/QuotaQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SignupResponseData } from "../../../models/signup/PostSignupResponse";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class SignupLogic {
    public mailer = new Mailer();
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;
    private quotaQueries: QuotaQueries;

    private traceId: string;
    private user: User = {};
    private token: string;
    private req: RequestTracing;


    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.quotaQueries = new QuotaQueries(parentSpanContext);
    }

    public async signupLogic(body: PostSignupRequest):Promise<SignupResponseData>{
        this.readPassword(body);
        this.readEmail(body);
        this.readUsername(body);

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
        return {
            "id": this.user.id,
            "token": this.token,
        };
    }

    private readPassword(body: PostSignupRequest): void {
        this.user.salt = generateSalt();
        this.user.hash = generatePasswordHash(body.pass, this.user.salt);
        this.user.session = generateSession();
    }

    private readEmail(body: PostSignupRequest): void {
        this.user.email = body.email;
        validateEmail(this.user.email, this.traceId);
    }

    private readUsername(body: PostSignupRequest): void {
        this.user.username = body.username;
    }

    private async checkIfEmailExists() {
        if (await this.usersQueries.CheckIfEmailAlreadyExists(this.user.email) > 0) {
            throw new AccountAlreadyExistsError(this.user.email, this.traceId);
        }
    }

    private async checkIfUsernameExists() {
        if (await this.usersQueries.CheckIfUsernameAlreadyExists(this.user.username) > 0) {
            throw new UsernameAlreadyExistsError(this.user.username, this.traceId);
        }
    }

    private async insertNewUser() {
        const result = await this.usersQueries.InsertNewUser(
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
            this.auditQueries.InsertInitialAudit(this.user.id),
            // Quota
            this.quotaQueries.InsertInitialQuota(this.user.id, 5242880),
        ]);

    }

    private generateAccessToken() {
        const accessToken: AccessToken = {
            userId: this.user.id.toString(),
            session: this.user.session.toString()
        };
        this.token = jwt.sign(accessToken, getJWTSecret(), {});
    }

    private async sendSignupMail() {
        await this.mailer.sendSignup(this.user);
    }
}
