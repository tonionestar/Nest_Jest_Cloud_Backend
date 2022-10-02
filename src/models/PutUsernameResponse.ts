import { ClippicResponse } from "./ClippicResponse";

export interface PutUsernameResponse extends ClippicResponse {
    data: PutUsernameResponseData[];
}

export interface PutUsernameResponseData {

    /**
     * The user's username
     * @example "tester"
     * @maxLength 40
     */
    username: string;

}
