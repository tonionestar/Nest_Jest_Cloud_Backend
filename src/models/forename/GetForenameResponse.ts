import { ClippicResponse } from "../ClippicResponse";

export interface GetForenameResponse extends ClippicResponse{

    data: GetForenameResponseData[];
}

export interface GetForenameResponseData {

    /**
     * The user's forename
     * @example "tester"
     * @maxLength 100
     */
    forename: string;

}
