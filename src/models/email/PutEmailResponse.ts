import { ClippicResponse } from "../ClippicResponse";

export interface PutEmailResponse extends ClippicResponse{

    data: PutEmailResponseData[];
}

export interface PutEmailResponseData {

    /**
     * The user's email
     * @example "test@clippic.app"
     * @maxLength 200
     * @type email
     */
    email: string;

}
