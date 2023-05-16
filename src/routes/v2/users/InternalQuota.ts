import {
    Body,
    Controller,
    Example,
    Patch,
    Post,
    Request,
    Response,
    Route,
    Security,
    Tags,
} from "tsoa";
import {
    getTraceContext,
    getTraceId,
} from "../../../classes/Common";
import {
    PostConsumptionResponse,
    PostConsumptionResponseData
} from "../../../models/internalQuota/PostConsumptionResponse";
import { ClippicResponse } from "../../../models/ClippicResponse";
import { InternalQuotaLogic } from "../usersLogic/InternalQuotaLogic";
import { PatchInternalSpaceRequest } from "../../../models/internalQuota/PatchInternalSpaceRequest";
import { PatchManageQuotaResponse } from "../../../models/internalQuota/PatchManageQuotaResponse";
import { PostConsumptionRequest } from "../../../models/internalQuota/PostConsumptionRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { UserIdNotFoundError } from "@clippic/clippic-errors";

@Route("/v2/internal/users/quota")
export class InternalQuotaController extends Controller {

    @Tags("InternalQuota")
    @Example<PostConsumptionResponse>({
        status: "success",
        message: "",
        data: {
            isSufficientQuota: true,
        },
        code: 200,
        trace: "4ba373202a8e4807",
    })
    @Security("jwt")
    @Response<UserIdNotFoundError>(400)
    @Post("/")
    public async postConsumptionRequest(@Request() req: RequestTracing, @Body() body: PostConsumptionRequest): Promise<PostConsumptionResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const internalQuotaLogic = new InternalQuotaLogic(req, parentSpanContext, traceId);
        const consumptionResponse: PostConsumptionResponseData = await internalQuotaLogic.consumptionRequestLogic(body);

        return {
            status: "success",
            message: "",
            data: consumptionResponse,
            code: 200,
            trace: traceId,
        };
    }

    @Tags("InternalQuota")
    @Example<ClippicResponse>({
        status: "success",
        code: 200,
        trace: "4ba373202a8e4807",
    })
    @Security("jwt")
    @Response<UserIdNotFoundError>(400)
    @Patch("/")
    public async patchInternalSpaceRequest(
        @Request() req: RequestTracing,
        @Body() body: PatchInternalSpaceRequest
    ): Promise<ClippicResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const internalQuotaLogic = new InternalQuotaLogic(req, parentSpanContext, traceId);
        await internalQuotaLogic.setUsedSpace(body.size);

        return {
            status: "success",
            code: 200,
            trace: traceId,
        };
    }

    @Tags("InternalQuota")
    @Example<PatchManageQuotaResponse>({
        status: "success",
        data: { totalSpace: 700 },
        code: 200,
        trace: "4ba373202a8e4807",
    })
    @Security("jwt")
    @Response<UserIdNotFoundError>(400)
    @Patch("/manage")
    public async PatchManageQuotaResponse(
        @Request() req: RequestTracing,
        @Body() body: PatchInternalSpaceRequest
    ): Promise<PatchManageQuotaResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const internalQuotaLogic = new InternalQuotaLogic(req, parentSpanContext, traceId);
        await internalQuotaLogic.setTotalSpace(body.size);

        const totalSpace = await internalQuotaLogic.getManagedQuota();
        return {
            status: "success",
            data: { totalSpace },
            code: 200,
            trace: traceId,
        };
    }


}
