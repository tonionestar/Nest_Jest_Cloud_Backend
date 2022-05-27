import express from "express";
import {
    AccessTokenExpiredError,
    AccessTokenMissingError, AccessTokenNotAllowedForUriError,
    BodyCountryInvalidError,
    BodyFieldIsNullError,
    BodyFieldToLongError,
    BodyFieldToShortError,
    BodyKeyIsMissingError,
    FCMSendError,
    ParseToBooleanError,
    ParseToNumberError,
    PasswordInvalidError, VerifyJWTError
} from "@clippic/clippic-errors"
import tracer from "../classes/Jaeger";
import admin, {messaging} from "firebase-admin";
import FirebaseCodes from "./FirebaseCodes";
import MulticastMessage = messaging.MulticastMessage;
import {opentracing} from "jaeger-client";
import Country from "./Country";
import RequestTracing from "./RequestTracing";
import crypto from "crypto";
import {verify} from "jsonwebtoken"


// Initialize country list
const country: Country = new Country

// Initialize firebase
const serviceAccount: string = require("../../serviceAccountKey.json");

// JWT
//const jwtExpires = 2592000; // (expires in 30 days)
const jwtSecret = "_?ASvsvt@_45E-%:trEkYjURE,w{#yZf7Fg)!5EV&dJv!<m{Gy#Q.X@qLwy{aAt:";


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://clippic-a12f8.firebaseio.com"
});
const fcm: messaging.Messaging = admin.messaging();


export function getJWTSecret (): string {
    return jwtSecret;
}

export function getTraceId (req: RequestTracing) {
    if (req.hasOwnProperty("span")) {
        return req.span.context().toTraceId();
    }
    return ""
}

export function checkIfJsonContainsFieldAndReturnValue(req: RequestTracing, res: express.Response, field: string): string {
    const bodyAsJSON = req.body;

    if (bodyAsJSON.hasOwnProperty(field)) {
        return bodyAsJSON[field];
    }

    throw new BodyKeyIsMissingError(field, getTraceId(req));
}

export function checkIfJsonContainsFieldAndReturnValueIfExists(req: RequestTracing, res: express.Response, field: string): any {
    const bodyAsJSON = req.body;

    if (bodyAsJSON.hasOwnProperty(field)) {
        if (bodyAsJSON[field] === "") {
            return null;
        } else {
            return bodyAsJSON[field];
        }
    }
    return null;
}

export function validatePasswordRegex(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/;
    return regex.test(password);
}

export function validatePassword(password: string, traceId: string): void {
    const passIsInvalid = !this.validatePasswordRegex(password);
    if (passIsInvalid) {
        throw new PasswordInvalidError(traceId);
    }
}

export function validateField(
    req: RequestTracing,
    res: express.Response,
    field: any,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = Number.MAX_SAFE_INTEGER
): void {

    // Check if null
    if (field == null && minLength == 0) {
        return;
    }
    else if (field == null && minLength > 0) {
        throw new BodyFieldIsNullError(fieldName, getTraceId(req));
    }
    // Get length
    if (field.length < minLength ) {
        throw new BodyFieldToShortError(fieldName, getTraceId(req));
    } else if (field.length > maxLength) {
        throw new BodyFieldToLongError(fieldName, getTraceId(req));
    }
}

export function validateAndProcessBoolean(
    req: RequestTracing,
    res: express.Response,
    field: any,
    fieldName: string
): boolean {
    if (typeof field === 'boolean') {
        return field;
    } else if (typeof field === 'number') {
        if (field === 0 || field === 1) {
            return Boolean(field);
        }
    } else if (typeof field === 'string') {
        if (field === "true") {
            return true;
        } else if (field === "false") {
            return false;
        }
    }

    throw new ParseToBooleanError(fieldName, getTraceId(req));
}

export function validateAndProcessNumber(
    req: RequestTracing,
    res: express.Response,
    field: any,
    fieldName: string
): number {
    if (typeof field === 'number') {
        return field;
    } else if (!isNaN(Number(field))) {
        return Number(field);
    }

    throw new ParseToNumberError(fieldName, getTraceId(req))
}

export function generateUsername(): string {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = "";
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export async function _sendFirebaseMessage(req: RequestTracing, message: MulticastMessage, span: opentracing.Span) {
    try {
        await this.fcm.sendMulticast(message);
    } catch (e) {
        span.log({
            'event': 'error',
            'error.object': e,
            'message': e.message,
            'stack': e.stack
        });
        span.finish();
        throw new FCMSendError(getTraceId(req));
    }
}

export async function sendFirebaseMessage(
    req: RequestTracing,
    res: express.Response,
    user_id: string,
    tokens: string[],
    userInformation: any,
    firebaseCode: string
) {
    const span = tracer.startSpan("Send firebase message", {
        childOf: req.span.context(),
    });
    span.setTag("component", "firebase");

    const message = {
        data: {
            message: userInformation['username'] + FirebaseCodes.firebaseCodes[firebaseCode],
            username: userInformation['username'],
            user_id: user_id,
            type: firebaseCode
        },
        tokens: tokens
    }

    if (tokens.length > 0) {
        await this._sendFirebaseMessage(req, message, span)
    }
    span.finish();
}

export async function sendFirebaseMessageRaw(
    req: RequestTracing,
    res: express.Response,
    user_id: string,
    tokens: string[],
    firebaseCode: string
) {
    const span = tracer.startSpan("Send firebase message raw", {
        childOf: req.span.context(),
    });
    span.setTag("component", "firebase");

    const message = {
        data: {
            message: FirebaseCodes.firebaseCodes[firebaseCode],
            user_id: user_id,
            type: firebaseCode
        },
        tokens: tokens
    }

    if (tokens.length > 0) {
        await this._sendFirebaseMessage(req, message, span)
    }
    span.finish();
}

export async function sendFirebaseMessageOrder(
    req: RequestTracing,
    res: express.Response,
    user_id: string,
    tokens: string[],
    firebaseCode: string,
    order_name: string,
    order_id: string
) {
    const span = tracer.startSpan("Send firebase message order", {
        childOf: req.span.context(),
    });
    span.setTag("component", "firebase");

    const message = {
        data: {
            message: FirebaseCodes.firebaseCodes[firebaseCode],
            order_name: order_name,
            order_id: order_id,
            user_id: user_id,
            type: firebaseCode
        },
        tokens: tokens
    }

    if (tokens.length > 0) {
        await this._sendFirebaseMessage(req, message, span)
    }
    span.finish();
}

export function processCountry(req: RequestTracing, res: express.Response): number {
    let country_id;
    if (req.body.hasOwnProperty("country")) {
        country_id = req.body['country'];
    } else if (req.body.hasOwnProperty("country_iso2")) {
        country_id = this.country.getIDFromISO2(req.body['country_iso2'])
    } else if (req.body.hasOwnProperty("country_iso3")) {
        country_id = this.country.getIDFromISO3(req.body['country_iso3'])
    }

    if (country_id === undefined || country_id === null) {
        throw new BodyCountryInvalidError(getTraceId(req));
    }

    return parseInt(country_id);
}


export function generatePasswordHash(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
}


/**
 * Checks if user provides an access token in request header and if its valid.
 * @param req
 * @param user
 * @returns {Promise<*>}
 */
function checkJWTAuthentication(req: RequestTracing, user: User) {

    const token = req.headers['x-access-token'][0];

    if (!token) {
        throw new AccessTokenMissingError(getTraceId(req))
    }
    let decodedToken;

    try {
        decodedToken = verify(token, jwtSecret) as AccessToken;
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            throw new AccessTokenNotAllowedForUriError(getTraceId(req));
        } else if (e.name === 'TokenExpiredError') {
            throw new AccessTokenExpiredError(getTraceId(req));
        }
        else {
            throw new VerifyJWTError(getTraceId(req));
        }
    }

    // Check if id from token is the same as from uri
    if (user.id !== decodedToken.userId) {
        throw new AccessTokenNotAllowedForUriError(getTraceId(req));
    }

    // Check if id from token is the same as from uri
    if (user.salt !== decodedToken.session) {
        throw new AccessTokenNotAllowedForUriError(getTraceId(req));
    }
}
