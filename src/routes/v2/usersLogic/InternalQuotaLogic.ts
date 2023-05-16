import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken
} from "../../../classes/Common";
import { PostConsumptionRequest } from "../../../models/internalQuota/PostConsumptionRequest";
import { PostConsumptionResponseData } from "../../../models/internalQuota/PostConsumptionResponse";
import { QuotaQueries } from "../../../database/query/QuotaQueries";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQuota } from "../../../models/UserQuota";
import { UsersQueries } from "../../../database/query/UsersQueries";

const MIN_TOTAL_SPACE = 5242880;

export class InternalQuotaLogic {

    private usersQueries: UsersQueries;
    private quotaQueries: QuotaQueries;
    private req: RequestTracing;
    private traceId: string;
    private user: User = {};
    private userQuota: UserQuota;

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.quotaQueries = new QuotaQueries(parentSpanContext);
    }

    public async consumptionRequestLogic(body: PostConsumptionRequest): Promise<PostConsumptionResponseData> {
        await this.checkRouteAccess();
        const isSufficientQuota = await this.isSufficientQuota(body);
        return { isSufficientQuota };
    }

    public async setUsedSpace(requestedSize: number) {
        await this.checkRouteAccess();

        const quota = await this.getQuota();
        const totalRequestedSize = quota.usedSpace + requestedSize;
        const isValidUsedSpace = this.isValidUsedSpace(totalRequestedSize, quota.totalSpace);
        const newSize = isValidUsedSpace ? totalRequestedSize : quota.usedSpace;

        await this.quotaQueries.UpdateQuota(
            this.user.id,
            newSize,
            quota.totalSpace
        );
    }

    public async setTotalSpace(requestedSize: number) {
        await this.checkRouteAccess();

        const quota = await this.getQuota();
        const newSize = Math.max(quota.totalSpace + requestedSize, MIN_TOTAL_SPACE);
        await this.quotaQueries.UpdateQuota(
            this.user.id,
            quota.usedSpace,
            newSize
        );
    }

    public async getManagedQuota(): Promise<number> {
        this.userQuota = await this.quotaQueries.GetUsersQuotaAll(this.user.id);
        const managedQuota = Number(this.userQuota.totalSpace);
        return managedQuota;
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async isSufficientQuota(consumptionRequest: PostConsumptionRequest) {
        const requestSize = consumptionRequest.requestSize;
        const internalSize = await this.getInternalSize();
        return requestSize <= internalSize;
    }


    private async getInternalSize(): Promise<number> {
        const userQuota = await this.quotaQueries.GetUsersQuotaAll(this.user.id);
        return userQuota.totalSpace - userQuota.usedSpace;
    }

    private async getQuota(): Promise<UserQuota> {
        const quota = await this.quotaQueries.GetUsersQuotaAll(this.user.id);
        return {
            ...quota,
            usedSpace: Number(quota.usedSpace),
            totalSpace: Number(quota.totalSpace)
        };
    }

    private isValidUsedSpace(newSize: number, totalSpace: number) {
        return newSize > 0 && newSize < totalSpace;
    }

}
