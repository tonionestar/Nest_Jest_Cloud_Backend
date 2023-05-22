import { Controller, Delete, Example, Request, Route, Security, Tags } from "tsoa";
import { getTraceContext, getTraceId } from "../../../classes/Common";
import { ClippicResponse } from "../../../models/ClippicResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { UsersLogic } from "../usersLogic/UsersLogic";

@Route("/v2/users")
export class UsersController extends Controller {
    @Tags("Users")
    @Example<ClippicResponse>({
        status: "success",
        message: "User has been deleted",
        data: [],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Delete("/")
    public async deleteUserRequest(@Request() req: RequestTracing): Promise<ClippicResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const usersLogic = new UsersLogic(req, parentSpanContext, traceId);
        await usersLogic.deleteUser();

        return {
            "status": "success",
            "message": "User has been deleted",
            "data": [],
            "code": 200,
            "trace": traceId
        };
    }

}
