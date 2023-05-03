import {
    Body,
    Controller,
    Example,
    Header,
    Patch,
    Post,
    Request,
    Response,
    Route,
    Security,
    Tags,
} from "tsoa";
import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId,
} from "../../../classes/Common";
import { ClippicResponse } from "../../../../src/models/ClippicResponse";
import { PatchInternalSpaceRequest } from "../../../models/internalQuota/PatchInternalSpaceRequest";
import { PostConsumptionRequest } from "../../../models/internalQuota/PostConsumptionRequest";
import { PostConsumptionResponse } from "../../../models/internalQuota/PostConsumptionResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserIdNotFoundError } from "@clippic/clippic-errors";
import { UserQueries } from "../../../database/query/UserQueries";
import { UserQuota } from "../../../models/UserQuota";

@Route("/v2/internal/users/quota")
export class InternalQuotaController extends Controller {
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};
    private userQuota: UserQuota;
    private isSufficientQuota: boolean;

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
    public async postConsumptionRequest(
        @Request() req: RequestTracing,
        @Header() id: string,
        @Body() body: PostConsumptionRequest
    ): Promise<PostConsumptionResponse> {
        await this.initialize(req, id);
        await this.getInternalSize();
        await this.setIsSufficientQuota(body);

        return {
            status: "success",
            message: "",
            data: { isSufficientQuota: this.isSufficientQuota },
            code: 200,
            trace: this.traceId,
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
        @Header() id: string,
        @Body() body: PatchInternalSpaceRequest
    ): Promise<ClippicResponse> {
        await this.initialize(req, id);
        await this.setUsedSpace(body.size);

        return {
            status: "success",
            code: 200,
            trace: this.traceId,
        };
    }

    private async initialize(req: RequestTracing, id: string) {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.id = id;

        await this.checkRouteAccess();
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async getUsersSession() {
        const result = await this.db.doQuery(
            this.parentSpanContext,
            this.db.GetUsersSession,
            this.user.id
        );
        this.user = Object.assign(this.user, result);
    }

    private async getInternalSize(): Promise<number> {
        this.userQuota = await this.db.doQuery(
            this.parentSpanContext,
            this.db.GetUsersQuotaAll,
            this.user.id
        );
        return this.userQuota.totalSpace - this.userQuota.usedSpace;
    }

    private async setIsSufficientQuota(
        consumptionRequest: PostConsumptionRequest
    ) {
        const requestSize = consumptionRequest.requestSize;
        const internalSize = await this.getInternalSize();
        this.isSufficientQuota = requestSize <= internalSize;
    }

    private async getConsumedQuota(): Promise<number>{
        this.userQuota = await this.db.doQuery(
            this.parentSpanContext,
            this.db.GetUsersQuotaAll,
            this.user.id
        );
        const consumedQuota = Number(this.userQuota.usedSpace);
        return consumedQuota;
    }

    private async setUsedSpace(requestedSize: number){
        const consumedQuota = await this.getConsumedQuota();
        const newSize = await this.isValidSpace(consumedQuota + requestedSize, Number(this.userQuota.totalSpace))? consumedQuota + requestedSize: consumedQuota;
        await this.db.doQuery(
            this.parentSpanContext,
            this.db.UpdateQuota,
            this.user.id,
            newSize
        );
    }

    private async isValidSpace(newSize: number, totalSpace: number){
        return newSize > 0 && newSize < totalSpace;
    }
}
