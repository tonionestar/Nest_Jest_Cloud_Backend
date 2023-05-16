import {
    Body,
    Controller,
    Example,
    Get,
    Put,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";

import {

    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { ForenameLogic } from "../usersLogic/ForenameLogic";
import { GetForenameResponse } from "../../../models/forename/GetForenameResponse";
import { PutForenameRequest } from "../../../models/forename/PutForenameRequest";
import { PutForenameResponse } from "../../../models/forename/PutForenameResponse";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/forename")
export class ForenameController extends Controller {

    /**
     * This request will return the user's forename.
     */
    @Tags("Forename")
    @Example<GetForenameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "forename": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getForenameRequest(@Request() req: RequestTracing): Promise<GetForenameResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const forenameLogic = new ForenameLogic(req, parentSpanContext, traceId);
        const forenameResponseData = await forenameLogic.getForenameLogic();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "forename": forenameResponseData
            }],
            "code": 200,
            "trace": traceId
        });
    }

    /**
     * This request will update or create if not exists the user's forename.
     */
    @Tags("Forename")
    @Example<PutForenameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "forename": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Put("/")
    public async putForenameRequest(@Request() req: RequestTracing, @Body() body: PutForenameRequest): Promise<PutForenameResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const forenameLogic = new ForenameLogic(req, parentSpanContext, traceId);
        const putForenameResponseData = await forenameLogic.putForenameLogic(body);
        return {
            "status": "success",
            "message": "",
            "data": [{
                "forename": putForenameResponseData
            }],
            "code": 200,
            "trace": traceId
        };
    }
}
