import { ClippicResponse } from "../ClippicResponse";

export interface GetEmailResponse extends ClippicResponse{

    data: GetEmailResponseData[];
}

export interface GetEmailResponseData {

    /**
     * The user's email
     * @example "test@clippic.app"
     * @maxLength 200
     * @type email
     */
    email: string;

}
