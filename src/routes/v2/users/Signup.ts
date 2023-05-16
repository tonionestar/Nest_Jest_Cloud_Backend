import {
    AccountAlreadyExistsError,
    IdAlreadyExistsError,
    MailFormatError,
    UsernameAlreadyExistsError,
} from "@clippic/clippic-errors";
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
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { PostSignupRequest } from "../../../models/signup/PostSignupRequest";
import { PostSignupResponse } from "../../../models/signup/PostSignupResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SignupLogic } from "../usersLogic/SignupLogic";

@Route("/v2/users/signup")
export class SignupController extends Controller {

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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const signupLogic = new SignupLogic(req, parentSpanContext, traceId);
        const signupResponseData = await signupLogic.signupLogic(body);

        return Promise.resolve({
            "status": "success",
            "message": "Account creation succeeded",
            "data": [signupResponseData],
            "code": 200,
            "trace": traceId
        });
    }
}
