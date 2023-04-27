import { ClippicResponse } from "../ClippicResponse";
import { UserQuota } from "../UserQuota";

export interface GetQuotaResponse extends ClippicResponse {

    data: UserQuota[];
}
