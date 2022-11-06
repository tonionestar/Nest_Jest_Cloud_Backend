import { ClippicResponse } from "../ClippicResponse";

export interface PutForenameResponse extends ClippicResponse {
    data: PutForenameResponseData[];
}

export interface PutForenameResponseData {

    /**
     * The user's forename
     * @example "tester"
     * @maxLength 100
     */
    forename: string;

}
