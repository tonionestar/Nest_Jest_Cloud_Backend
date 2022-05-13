import Common from "../../../classes/Common";

// 3rd party modules
import * as express from "express";
import { ClippicError } from "@clippic/clippic-errors";
import RequestTracing from "../../../classes/RequestTracing";
import { UserQueries } from "../../../database/query/UserQueries";

class LoginController {
    public path = "/users/login"
    public router = express.Router();
    public db = new UserQueries();

    private traceId: string;
    private id: string;
    private salt: string;
    private hash: string;

    private password: string;
    private email: string;
    private username: string;

    private user: User;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path, this.login);
    }

    private readPassword(req: RequestTracing, res: express.Response): void {
        this.password = Common.checkIfJsonContainsFieldAndReturnValue(req, res, "pass");
    }

    private readEmail(req: RequestTracing, res: express.Response): void {
        this.email = Common.checkIfJsonContainsFieldAndReturnValueIfExists(req, res, "email");
    }

    private readUsername(req: RequestTracing, res: express.Response): void {
        this.username = Common.checkIfJsonContainsFieldAndReturnValueIfExists(req, res, "username");
    }

    login = async (req: RequestTracing, res: express.Response) => {
        this.traceId = Common.getTraceId(req);

        try {
            this.readPassword(req, res);
            this.readEmail(req, res);
            this.readUsername(req, res);
        } catch (e) {
            if (e instanceof ClippicError) {
                return res.status(422).send(e.toJSON())
            } else {
                req.span.log({
                    event: "error",
                    stack: e.stack
                })
                return res.status(500).send();
            }
        }

        if (this.email !== null) {
            // Check if mail is valid
            //mailer.validateEmail(req, res, email);
            //if (res.headersSent) {return;}

            this.user = await this.db.GetUsersInformationByEMail(this.email);
        } else {
            // test
        }

        res.status(200).send(this.user);
    }
}

export {
    LoginController
}
