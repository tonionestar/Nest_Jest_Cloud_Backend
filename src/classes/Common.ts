import express from "express";
import {
    BodyCountryInvalidError,
    BodyFieldIsNullError,
    BodyFieldToLongError,
    BodyFieldToShortError,
    BodyKeyIsMissingError,
    FCMSendError,
    ParseToBooleanError,
    ParseToNumberError,
    PasswordInvalidError
} from "@clippic/clippic-errors"
import tracer from "../classes/Jaeger";
import admin, {messaging} from "firebase-admin";
import FirebaseCodes from "./FirebaseCodes";
import MulticastMessage = messaging.MulticastMessage;
import {opentracing} from "jaeger-client";
import Country from "./Country";
import RequestTracing from "./RequestTracing";
import * as fs from "fs";

class Common {

    private fcm: messaging.Messaging;
    private country: Country;
    private readonly serviceAccount: string;

    constructor() {
        this.serviceAccount = fs.readFileSync("../../serviceAccountKey.json", "utf-8");
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: "https://clippic-a12f8.firebaseio.com"
        });

        this.fcm = admin.messaging();
        this.country = new Country();
    }

    public static getTraceId (req: RequestTracing) {
        if (req.hasOwnProperty("span")) {
            return req.span.context().toTraceId();
        }
        return ""
    }

    public static checkIfJsonContainsFieldAndReturnValue(req: RequestTracing, res: express.Response, field: string): string {
        const bodyAsJSON = req.body;

        if (bodyAsJSON.hasOwnProperty(field)) {
            return bodyAsJSON[field];
        }

        throw new BodyKeyIsMissingError(field, Common.getTraceId(req));
    }

    public static checkIfJsonContainsFieldAndReturnValueIfExists(req: RequestTracing, res: express.Response, field: string): any {
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

    public static validatePasswordRegex(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/;
        return regex.test(password);
    }

    public validatePassword(req: RequestTracing, res: express.Response, password: string): void {
        const passIsInvalid = !Common.validatePasswordRegex(password);
        if (passIsInvalid) {
            throw new PasswordInvalidError(Common.getTraceId(req));
        }
    }

    public validateField(
        req: RequestTracing,
        res: express.Response,
        field: any,
        fieldName: string,
        minLength: number = 1,
        maxLength: number = Number.MAX_SAFE_INTEGER
    ): void {
        // Check if null
        if (field == null && minLength > 0) {
            throw new BodyFieldIsNullError(fieldName, Common.getTraceId(req));
        }
        // Get length
        if (field.length < minLength ) {
            throw new BodyFieldToShortError(fieldName, Common.getTraceId(req));
        } else if (field.length > maxLength) {
            throw new BodyFieldToLongError(fieldName, Common.getTraceId(req));
        }
    }

    public validateAndProcessBoolean(
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

        throw new ParseToBooleanError(fieldName, Common.getTraceId(req));
    }

    public validateAndProcessNumber(
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

        throw new ParseToNumberError(fieldName, Common.getTraceId(req))
    }

    public static generateUsername(): string {
        const length = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = "";
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    private async _sendFirebaseMessage(req: RequestTracing, message: MulticastMessage, span: opentracing.Span) {
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
            throw new FCMSendError(Common.getTraceId(req));
        }
    }

    public async sendFirebaseMessage(
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

    public async sendFirebaseMessageRaw(
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

    public async sendFirebaseMessageOrder(
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

    public processCountry(req: RequestTracing, res: express.Response): number {
        let country_id;
        if (req.body.hasOwnProperty("country")) {
            country_id = req.body['country'];
        } else if (req.body.hasOwnProperty("country_iso2")) {
            country_id = this.country.getIDFromISO2(req.body['country_iso2'])
        } else if (req.body.hasOwnProperty("country_iso3")) {
            country_id = this.country.getIDFromISO3(req.body['country_iso3'])
        }

        if (country_id === undefined || country_id === null) {
            throw new BodyCountryInvalidError(Common.getTraceId(req));
        }

        return parseInt(country_id);
    }
}

export default Common;
