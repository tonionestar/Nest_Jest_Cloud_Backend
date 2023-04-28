import * as jwt from "jsonwebtoken";

import {
    AccessTokenExpiredError,
    AccessTokenMissingError,
    AccessTokenNotAllowedForUriError
} from "@clippic/clippic-errors";

import { getJWTSecret } from "./classes/Common";
import { RequestTracing } from "./models/RequestTracing";

export function expressAuthentication(
    request: RequestTracing,
    securityName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scopes?: string[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {

    if (securityName === "jwt") {
        const token =
            request.body.token ||
            request.query.token ||
            request.headers["x-access-token"];

        let traceId: string;

        // eslint-disable-next-line no-prototype-builtins
        if (request.hasOwnProperty("span")) {
            traceId =  request.span.context().toTraceId();
        }

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new AccessTokenMissingError(traceId));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            jwt.verify(token, getJWTSecret(), function (err: any, decoded: any) {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        reject(new AccessTokenExpiredError(traceId));
                    }
                    reject(new AccessTokenNotAllowedForUriError(traceId));
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
