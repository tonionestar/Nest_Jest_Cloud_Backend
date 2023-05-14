import {
    AccountAlreadyExistsError,
    MailFormatError
} from "@clippic/clippic-errors";
import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Put,
    Request,
    Response,
    Route,
    Security,
    Tags
} from "tsoa";
import {
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { EmailLogic } from "../usersLogic/EmailLogic";
import { GetEmailResponse } from "../../../models/email/GetEmailResponse";
import { PutEmailRequest } from "../../../models/email/PutEmailRequest";
import { PutEmailResponse } from "../../../models/email/PutEmailResponse";
import { RequestTracing } from "../../../models/RequestTracing";


@Route("/v2/users/email")
export class EmailController extends Controller {

    /**
     * This request will return the user's Email.
     */
    @Tags("Email")
    @Example<GetEmailResponse>({
        status: "success",
        message: "",
        data: [
            {
                "email": "test@clippic.app"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getEmailRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetEmailResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const emailLogic = new EmailLogic(req, id, parentSpanContext, traceId);
        const emailResponseData: string = await emailLogic.getEmailLogic();
        return {
            "status": "success",
            "message": "",
            "data": [{
                "email": emailResponseData
            }],
            "code": 200,
            "trace": traceId
        };
    }

    /**
     * This request will update the user's email.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | AccountAlreadyExistsError   |
     * | 400  | MailFormatError             |
     */
    @Tags("Email")
    @Example<PutEmailResponse>({
        status: "success",
        message: "",
        data: [
            {
                "email": "testnew@clippic.app"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Response<AccountAlreadyExistsError>(400)
    @Response<MailFormatError>(400)
    @Security("jwt")
    @Put("/")
    public async putEmailRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutEmailRequest): Promise<PutEmailResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const emailLogic = new EmailLogic(req, id, parentSpanContext, traceId);
        const PutEmailResponseData = await emailLogic.putEmailLogic(body);
        return {
            "status": "success",
            "message": "",
            "data": [{
                "email": PutEmailResponseData
            }],
            "code": 200,
            "trace": traceId
        };
    }
}
