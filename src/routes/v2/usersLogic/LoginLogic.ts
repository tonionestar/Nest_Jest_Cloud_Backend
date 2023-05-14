import * as jwt from "jsonwebtoken";
import { generatePasswordHash, getJWTSecret } from "../../../classes/Common";
import { GetAuditError, PasswordWrongError, UsernameOrMailRequiredError } from "@clippic/clippic-errors";
import { AccessToken } from "../../../models/AccessToken";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { LoginResponseData } from "../../../models/login/PostLoginResponse";
import { PostLoginRequest } from "../../../models/login/PostLoginRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserAudit } from "../../../models/UserAudit";
import { UsersQueries } from "../../../database/query/UsersQueries";
import { validateEmail } from "../../../classes/Mailer";

export class LoginLogic {
    private usersQueries: UsersQueries;
    private auditQueries: AuditQueries;

    private req: RequestTracing;
    private traceId: string;

    private password: string;
    private email: string;
    private username: string;
    private userAudit: Partial<UserAudit>;
    private prove: string;
    private token: string;

    private user: User = {};

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
    }

    public async loginLogic(body: PostLoginRequest): Promise<LoginResponseData> {
        this.readPassword(body);
        this.readEmail(body);
        this.readUsername(body);

        this.checkRequiredFieldsExists();

        if (this.email !== undefined) {
            this.user = await this.usersQueries.GetUsersInformationByEMail(this.email);
        } else {
            this.user = await this.usersQueries.GetUsersInformationByUsername(this.username);
        }

        this.checkIfUserExists();
        await this.getUsersAudit();
        this.prove = generatePasswordHash(this.password, this.user.salt);
        this.generateAccessToken();
        this.checkPassword();
        return {
            "created": this.userAudit.created,
            "id": this.user.id,
            "lastModified": this.userAudit.modified,
            "token": this.token,
        };
    }

    private readPassword(body: PostLoginRequest): void {
        this.password = body.pass;
    }

    private readEmail(body: PostLoginRequest): void {
        this.email = body.email;
        if (this.email != null) {
            validateEmail(this.email, this.traceId);
        }
    }

    private readUsername(body: PostLoginRequest): void {
        this.username = body.username;
    }

    private checkPassword() {
        if (this.user.hash !== this.prove) {
            throw new PasswordWrongError(this.traceId);
        }
    }

    private checkRequiredFieldsExists(): void {
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
        this.userAudit = await this.auditQueries.GetUsersAudit(this.user.id);
        if (this.userAudit == null) {
            throw new GetAuditError(this.traceId);
        }
    }

    private generateAccessToken() {
        const accessToken: AccessToken = {
            userId: this.user.id.toString(),
            session: this.user.session.toString()
        };
        this.token = jwt.sign(accessToken, getJWTSecret(), {});
    }
}
