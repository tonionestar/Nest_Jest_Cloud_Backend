import * as express from "express";
import {
    Controller,
    Example,
    Get,
    Header,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";

import {
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import { AuditLogic } from "../usersLogic/AuditLogic";
import { GetAuditResponse } from "../../../models/audit/GetAuditResponse";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/audit")
export class AuditController extends Controller {

    public router = express.Router();


    /**
     * This request will return the user's last modified dates.
     */
    @Tags("Audit")
    @Example<GetAuditResponse>({
        status: "success",
        message: "",
        data: [
            {
                "user_id": "551efd1e-77c1-49a1-9a9b-c7fa15ce6acf",
                "modified": "2022-11-06T11:14:00.000Z",
                "created": "2022-11-06T11:14:00.000Z",
                "username": null,
                "forename": null,
                "surname": null,
                "email": null,
                "hash": null,
                "billing": null,
                "shipping": null,
                "quota": null
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getAuditRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetAuditResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const auditLogic = new AuditLogic(req, id, parentSpanContext, traceId);

        const userAuditDataResponse = await auditLogic.getUsersAuditLogic();
        return {
            "status": "success",
            "message": "",
            "data": [
                userAuditDataResponse
            ],
            "code": 200,
            "trace": traceId
        };
    }

}
