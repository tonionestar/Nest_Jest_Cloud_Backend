import {
    Controller,
    Example,
    Get,
    Query,
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

import { GetIdResponse } from "../../../models/id/GetIdResponse";
import { IdLogic } from "../usersLogic/IdLogic";
import { RequestTracing } from "../../../models/RequestTracing";
import { UserMailNotFoundError } from "@clippic/clippic-errors";

@Route("/v2/users/id")
export class IdController extends Controller {

    /**
     * This request will return the id of any kind of user by its email address. This can not be used to fetch your own
     * user id cause this route requires authorization.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | UserMailNotFoundError       |
     */
    @Tags("Id")
    @Response<UserMailNotFoundError>(400)
    @Example<GetIdResponse>({
        status: "success",
        message: "",
        data: [
            {
                "id": "52907745-7672-470e-a803-a2f8feb52944"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getIdByEmailRequest(@Request() req: RequestTracing, @Query() email: string): Promise<GetIdResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const idLogic = new IdLogic(req, parentSpanContext, traceId);
        const userId = await idLogic.getIdByEmailLogic(email);

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "id": userId
            }],
            "code": 200,
            "trace": traceId
        });
    }
}
