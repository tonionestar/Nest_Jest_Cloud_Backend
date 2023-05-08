import { ClippicResponse } from "../ClippicResponse";

export interface PatchManageQuotaResponse extends ClippicResponse {
    data: PatchManageQuotaResponseData;
}

export interface PatchManageQuotaResponseData {
    totalSpace: number;
}
