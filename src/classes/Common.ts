import {
    AccessTokenNotAllowedForUriError,
    FCMSendError,
    PasswordInvalidError
} from "@clippic/clippic-errors";
import admin, { messaging } from "firebase-admin";

import { AccessToken } from "../models/AccessToken";
import crypto from "crypto";
import { decode } from "jsonwebtoken";
import MulticastMessage = messaging.MulticastMessage;
import { opentracing } from "jaeger-client";
import { RequestTracing } from "../models/RequestTracing";
import { SpanContext } from "opentracing";
import tracer from "./Jaeger";
import { User } from "../models/User";


// Initialize firebase
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount: string = require("../../serviceAccountKey.json");

// JWT
//const jwtExpires = 2592000; // (expires in 30 days)
const jwtSecret = "_?ASvsvt@_45E-%:trEkYjURE,w{#yZf7Fg)!5EV&dJv!<m{Gy#Q.X@qLwy{aAt:";


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://clippic-a12f8.firebaseio.com"
});
// const fcm: messaging.Messaging = admin.messaging();


export function getJWTSecret (): string {
    return jwtSecret;
}

export function getTraceContext (req: RequestTracing) {
    // eslint-disable-next-line no-prototype-builtins
    if (req.hasOwnProperty("span")) {
        return req.span.context();
    }
    return new SpanContext();
}

export function getTraceId (req: RequestTracing) {
    // eslint-disable-next-line no-prototype-builtins
    if (req.hasOwnProperty("span")) {
        return req.span.context().toTraceId();
    }
    return "";
}

export function validatePasswordRegex(password: string): boolean {
    // eslint-disable-next-line no-useless-escape
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/;
    return regex.test(password);
}

export function validatePassword(password: string, traceId: string): void {
    const passIsInvalid = !validatePasswordRegex(password);
    if (passIsInvalid) {
        throw new PasswordInvalidError(traceId);
    }
}

export async function _sendFirebaseMessage(req: RequestTracing, message: MulticastMessage, span: opentracing.Span) {
    try {
        await this.fcm.sendMulticast(message);
    } catch (e) {
        span.log({
            "event": "error",
            "error.object": e,
            "message": e.message,
            "stack": e.stack
        });
        span.finish();
        throw new FCMSendError(getTraceId(req));
    }
}

export function generatePasswordHash(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function generateSalt() {
    return crypto.randomBytes(16).toString("hex");
}
export function generateSession() {
    return crypto.randomBytes(16).toString("hex");
}

export function getJWTTokenFromHeaders(req: RequestTracing): string {
    const tokenFromHeaders = req.headers["x-access-token"];
    let token: string;
    if (typeof tokenFromHeaders != "string") {
        throw new AccessTokenNotAllowedForUriError(getTraceId(req));
    } else {
        token = tokenFromHeaders.toString();
    }
    return token;
}

export function checkJWTAuthenticationUserId(req: RequestTracing, user: User) {
    const token: string = getJWTTokenFromHeaders(req);

    const decodedToken: AccessToken = decode(token) as AccessToken;

    // Check if id from token is the same as from uri
    if (user.id != decodedToken.userId) {
        throw new AccessTokenNotAllowedForUriError(getTraceId(req));
    }
}

export function checkJWTAuthenticationSession(req: RequestTracing, user: User) {
    const token: string = getJWTTokenFromHeaders(req);

    const decodedToken: AccessToken = decode(token) as AccessToken;

    // Check if id from token is the same as from uri
    if (user.session != decodedToken.session) {
        throw new AccessTokenNotAllowedForUriError(getTraceId(req));
    }
}

/**
 * decorator function, to wrap span tracing on db queries
 */
export function trace(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any) {
        const span = tracer.startSpan(originalMethod.name, { childOf: this.parentSpanContext });
        span.setTag("component", "db");
        const result = await originalMethod.call(this, ...args);
        span.finish();
        return result;
    };
};
