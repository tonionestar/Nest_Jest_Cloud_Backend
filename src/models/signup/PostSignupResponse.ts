import { ClippicResponse } from "../ClippicResponse";

export interface PostSignupResponse extends ClippicResponse {

    data: SignupResponseData[];
}

export interface SignupResponseData {

    /**
     * Stringified UUIDv4.
     * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
     * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
     * @format uuid
     */
    id: string;

    /**
     * JWT access token.
     */
    token: string;
}
