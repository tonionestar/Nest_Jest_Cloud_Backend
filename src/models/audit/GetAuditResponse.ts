import { ClippicResponse } from "../ClippicResponse";
import {UserAudit} from "../UserAudit";

export interface GetAuditResponse extends ClippicResponse {

    data: UserAudit[];
}
