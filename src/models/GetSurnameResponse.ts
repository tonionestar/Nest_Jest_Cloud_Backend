import { ClippicResponse } from "./ClippicResponse";

export interface GetSurnameResponse extends ClippicResponse{

    data: GetSurnameResponseData[];
}

export interface GetSurnameResponseData {

    /**
     * The user's surname
     * @example "tester"
     * @maxLength 100
     */
    surname: string;

}
