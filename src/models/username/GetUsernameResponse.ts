import { ClippicResponse } from "../ClippicResponse";

export interface GetUsernameResponse extends ClippicResponse{

    data: GetUsernameResponseData[];
}

export interface GetUsernameResponseData {

    /**
     * The user's username
     * @example "tester"
     * @maxLength 40
     */
    username: string;

}
