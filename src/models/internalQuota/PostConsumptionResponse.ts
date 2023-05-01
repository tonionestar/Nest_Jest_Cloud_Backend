import { ClippicResponse } from "../ClippicResponse";

export interface PostConsumptionResponse extends ClippicResponse {

    data: PostConsumptionResponseData;
}

export interface PostConsumptionResponseData {
    isSufficientQuota: boolean
}
