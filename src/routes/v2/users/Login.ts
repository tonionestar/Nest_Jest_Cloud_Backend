// 3rd party modules
import * as express from "express";
import * as jwt from "jsonwebtoken";

import {
    BodyFieldIsNullError,
    BodyFieldToLongError,
    BodyFieldToShortError,
    BodyKeyIsMissingError,
    GetAuditError,
    MailFormatError,
    PasswordWrongError,
    UsernameOrMailRequiredError
} from "@clippic/clippic-errors";
import RequestTracing from "../../../classes/RequestTracing";
import { UserQueries } from "../../../database/query/UserQueries";
import {UsersLength} from "../../../database/length/UsersLength";
import {
    checkIfJsonContainsFieldAndReturnValue,
    checkIfJsonContainsFieldAndReturnValueIfExists,
    generatePasswordHash,
    getJWTSecret,
    getTraceId,
    validateField,
} from "../../../classes/Common";
import {validateEmail} from "../../../classes/Mailer";

class LoginController {
    public path = "/users/v2/login"
    public router = express.Router();
    public db = new UserQueries();

    private traceId: string;

    private password: string;
    private email: string;
    private username: string;

    private user: User;
    private userAudit: UserAudit;

    private prove: string;
    private token: string;

    private req: RequestTracing;
    private res: express.Response;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path, this.login);
    }

    private readPassword(): void {
        this.password = checkIfJsonContainsFieldAndReturnValue(this.req, this.res, "pass");
        validateField(this.req, this.res, this.password, "pass", 1);
    }

    private readEmail(): void {
        this.email = checkIfJsonContainsFieldAndReturnValueIfExists(this.req, this.res, "email");
        validateField(this.req, this.res, this.email, "email", 0, UsersLength.email);
        if (this.email != null) {
            validateEmail(this.req, this.res, this.email);
        }
    }

    private readUsername(): void {
        this.username = checkIfJsonContainsFieldAndReturnValueIfExists(this.req, this.res, "username");
        validateField(this.req, this.res, this.username, "username", 0, UsersLength.username);
    }

    private checkPassword() {
        if (this.user.hash !== this.prove) {
            throw new PasswordWrongError(this.traceId);
        }
    }

    private checkRequiredFieldsExists(): void  {
        if ((this.email === null && this.username === null) || (this.email !== null && this.username !== null)) {
            throw new UsernameOrMailRequiredError(this.traceId);
        }
    }

    private checkIfUserExists(): void {
        if (this.user == undefined) {
            throw new PasswordWrongError(this.traceId);
        }
    }

    private async getUsersAudit() {
        this.userAudit = await this.db.GetUsersAudit(this.user.id);
        if (this.userAudit == null) {
            throw new GetAuditError(this.traceId)
        }
    }

    private generateAccessToken() {
        const accessToken: AccessToken = {
            userId: this.user.id,
            session: this.user.salt
        }
        this.token = jwt.sign(accessToken, getJWTSecret(), {});
    }

    login = async (req: RequestTracing, res: express.Response) => {
        this.req = req;
        this.res = res;
        this.traceId = getTraceId(req);

        try {
            this.readPassword();
            this.readEmail();
            this.readUsername();
        } catch (e) {
            if (e instanceof BodyFieldIsNullError) {
                return res.status(409).send(e.toJSON())
            } else if (e instanceof BodyFieldToShortError) {
                return res.status(409).send(e.toJSON())
            } else if (e instanceof BodyFieldToLongError) {
                return res.status(409).send(e.toJSON())
            } else if (e instanceof MailFormatError) {
                return res.status(409).send(e.toJSON())
            } else if (e instanceof BodyKeyIsMissingError) {
                return res.status(422).send(e.toJSON())
            } else {
                return res.status(500).send();
            }
        }

        try {
            this.checkRequiredFieldsExists();
        } catch (e) {
            if (e instanceof UsernameOrMailRequiredError) {
                return res.status(400).send(e.toJSON())
            } else {
                return res.status(500).send();
            }
        }

        if (this.email !== null) {
            this.user = await this.db.GetUsersInformationByEMail(this.email);
        } else if (this.username !== null) {
            this.user = await this.db.GetUsersInformationByUsername(this.username);
        }

        // Check if user exists
        try {
            this.checkIfUserExists();
        } catch (e) {
            if (e instanceof PasswordWrongError) {
                return res.status(401).send(e.toJSON())
            } else {
                return res.status(500).send();
            }
        }

        // Get Audit
        const auditAsync = this.getUsersAudit();

        // Generate a password hash by users password
        this.prove = generatePasswordHash(this.password, this.user.salt);

        try {
            await auditAsync;
        } catch (e) {
            if (e instanceof GetAuditError) {
                return res.status(500).send(e.toJSON())
            } else {
                return res.status(500).send();
            }
        }

        this.generateAccessToken();

        // Check if
        try {
            this.checkPassword();

            return res.status(200).send({
                "status": "success",
                "message": "",
                "data": [{
                    "created": this.userAudit.created,
                    "id": this.user.id,
                    "last_modified": this.userAudit.modified,
                    "token": this.token,
                }],
                "code": 200,
                "trace": this.traceId
            });
        } catch (e) {
            if (e instanceof PasswordWrongError) {
                return res.status(401).send(e.toJSON())
            } else {
                return res.status(500).send();
            }
        }
    }
}

export {
    LoginController
}
