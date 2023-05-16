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
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { ClippicResponse } from "../../../models/ClippicResponse";
import { PasswordInvalidError } from "@clippic/clippic-errors";
import { PasswordLogic } from "../usersLogic/PasswordLogic";
import { PutPasswordRequest } from "../../../models/password/PutPasswordRequest";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/password")
export class PasswordController extends Controller {

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
    public async changePassword(@Request() req: RequestTracing, @Body() body: PutPasswordRequest): Promise<ClippicResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const passwordLogic = new PasswordLogic(req, parentSpanContext, traceId);
        await passwordLogic.changePasswordLogic(body);

        return Promise.resolve({
            "status": "success",
            "message": "Password changed successfully",
            "data": [],
            "code": 200,
            "trace": traceId
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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const passwordLogic = new PasswordLogic(req, parentSpanContext, traceId);
        await passwordLogic.forgotPasswordLogic(email);

        return Promise.resolve({
            "status": "success",
            "message": "Password reset instructions has been sent if email address is registered.",
            "data": [],
            "code": 200,
            "trace": traceId
        });
    }
}
