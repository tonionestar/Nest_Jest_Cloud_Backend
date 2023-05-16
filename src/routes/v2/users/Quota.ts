import {
    Controller,
    Example,
    Get,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";

import {
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { GetQuotaResponse } from "../../../models/quota/GetQuotaResponse";
import { QuotaLogic } from "../usersLogic/QuotaLogic";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/quota")
export class QuotaController extends Controller {

    /**
     * This request will return the user's last modified dates.
     */
    @Tags("Quota")
    @Example<GetQuotaResponse>({
        status: "success",
        message: "",
        data: [{
            "userId": "551efd1e-77c1-49a1-9a9b-c7fa15ce6acf",
            "usedSpace": 300,
            "totalSpace": 700,
        }],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getQuotaRequest(@Request() req: RequestTracing): Promise<GetQuotaResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const quotaLogic = new QuotaLogic(req, parentSpanContext, traceId);
        const quotaResponse = await quotaLogic.getUserQuotaLogic();

        return {
            "status": "success",
            "message": "",
            "data": [
                quotaResponse
            ],
            "code": 200,
            "trace": traceId
        };
    }
}
