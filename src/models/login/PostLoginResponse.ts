import { ClippicResponse } from "../ClippicResponse";

export interface PostLoginResponse extends ClippicResponse {

    data: LoginResponseData[];
}

export interface LoginResponseData {

    /**
     * The datetime string when the account was created.
     * @format date
     */
    created: string;

    /**
     * Stringified UUIDv4.
     * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
     * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
     * @format uuid
     */
    id: string;

    /**
     * The datetime string when the account was last modified.
     * @format date
     */
    lastModified: string;

    /**
     * JWT access token.
     */
    token: string;
}
