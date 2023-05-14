import * as express from "express";

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
import { getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { LoginLogic } from "../usersLogic/LoginLogic";
import { PostLoginRequest } from "../../../models/login/PostLoginRequest";
import { PostLoginResponse } from "../../../models/login/PostLoginResponse";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/login")
export class LoginController extends Controller {

    public router = express.Router();



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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const loginLogic = new LoginLogic(req,  parentSpanContext, traceId);
        const loginResponseData = await loginLogic.loginLogic(body);
        return Promise.resolve({
            "status": "success",
            "message": "Login succeeded",
            "data": [loginResponseData],
            "code": 200,
            "trace": traceId
        });
    }
}
