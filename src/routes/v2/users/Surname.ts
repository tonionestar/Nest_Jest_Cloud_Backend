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
import { GetSurnameResponse } from "../../../models/surname/GetSurnameResponse";
import { PutSurnameRequest } from "../../../models/surname/PutSurnameRequest";
import { PutSurnameResponse } from "../../../models/surname/PutSurnameResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SurnameLogic } from "../usersLogic/SurnameLogic";

@Route("/v2/users/surname")
export class SurnameController extends Controller {

    /**
     * This request will return the user's surname.
     */
    @Tags("Surname")
    @Example<GetSurnameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "surname": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getSurnameRequest(@Request() req: RequestTracing): Promise<GetSurnameResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const surnameLogic = new SurnameLogic(req, parentSpanContext, traceId);
        const usersSurname = await surnameLogic.getUsersSurnameLogic();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "surname": usersSurname
            }],
            "code": 200,
            "trace": traceId
        });
    }

    /**
     * This request will update or create if not exists the user's surname.
     */
    @Tags("Surname")
    @Example<PutSurnameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "surname": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Put("/")
    public async putSurnameRequest(@Request() req: RequestTracing, @Body() body: PutSurnameRequest): Promise<PutSurnameResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const surnameLogic = new SurnameLogic(req, parentSpanContext, traceId);
        const updateSurnameResponse = await surnameLogic.updateSurnameLogic(body);

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "surname": updateSurnameResponse
            }],
            "code": 200,
            "trace": traceId
        });
    }
}
