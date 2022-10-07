import { ClippicResponse } from "./ClippicResponse";

export interface GetIdResponse extends ClippicResponse{

    data: GetIdResponseData[];
}

export interface GetIdResponseData {

    /**
     * The user's id
     * @example "52907745-7672-470e-a803-a2f8feb52944"
     * @maxLength 36
     */
    id: string;

}
