import {
    AccessTokenExpiredError,
    AccessTokenMissingError,
    AccessTokenNotAllowedForUriError
} from "@clippic/clippic-errors";
import * as jwt from "jsonwebtoken";
import { getJWTSecret, getTraceId } from "./classes/Common";
import { RequestTracing } from "./models/RequestTracing";

export function expressAuthentication(
    request: RequestTracing,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "jwt") {
        const token =
            request.body.token ||
            request.query.token ||
            request.headers["x-access-token"];

        let traceId: string;

        if (request.hasOwnProperty("span")) {
            traceId =  request.span.context().toTraceId();
        }

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new AccessTokenMissingError(traceId));
            }
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
