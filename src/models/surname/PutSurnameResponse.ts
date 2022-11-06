import { ClippicResponse } from "../ClippicResponse";

export interface PutSurnameResponse extends ClippicResponse {
    data: PutSurnameResponseData[];
}

export interface PutSurnameResponseData {

    /**
     * The user's surname
     * @example "tester"
     * @maxLength 100
     */
    surname: string;

}
