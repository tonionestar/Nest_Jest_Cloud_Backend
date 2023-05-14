import * as express from "express";

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
import { GetUsernameResponse } from "../../../models/username/GetUsernameResponse";
import { PutUsernameRequest } from "../../../models/username/PutUsernameRequest";
import { PutUsernameResponse } from "../../../models/username/PutUsernameResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { UsernameAlreadyExistsError } from "@clippic/clippic-errors";
import { UsernameLogic } from "../usersLogic/UsernameLogic";

@Route("/v2/users/username")
export class UsernameController extends Controller {

    public router = express.Router();


    /**
     * This request will return the user's username.
     */
    @Tags("Username")
    @Example<GetUsernameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "username": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getUsernameRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetUsernameResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const usernameLogic = new UsernameLogic(req, id, parentSpanContext, traceId);
        const usersUsername = await usernameLogic.getUsersUsernameLogic();

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "username": usersUsername
            }],
            "code": 200,
            "trace": traceId
        });
    }

    /**
     * This request will update or create if not exists the user's username.
     *
     * **Errors:**
     *
     * | Code | Description                 |
     * |------|-----------------------------|
     * | 400  | UsernameAlreadyExistsError  |
     */
    @Tags("Username")
    @Example<PutUsernameResponse>({
        status: "success",
        message: "",
        data: [
            {
                "username": "tester"
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Response<UsernameAlreadyExistsError>(400)
    @Security("jwt")
    @Put("/")
    public async putUsernameRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutUsernameRequest): Promise<PutUsernameResponse> {

        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const usernameLogic = new UsernameLogic(req, id, parentSpanContext, traceId);
        const usersUsername = await usernameLogic.updateUsersUsername(body);

        return Promise.resolve({
            "status": "success",
            "message": "",
            "data": [{
                "username": usersUsername
            }],
            "code": 200,
            "trace": traceId
        });
    }
}
