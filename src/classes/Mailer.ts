import {MailFormatError} from "@clippic/clippic-errors";
import {getTraceId} from "./Common";
import RequestTracing from "./RequestTracing";
import express from "express";

export function validateEmail(req: RequestTracing, res: express.Response, email: string): void {
    const emailIsInvalid = !validateEmailRegex(email);
    if (emailIsInvalid) {
        throw new MailFormatError(email, getTraceId(req));
    }
}

/**
 * Validate email against common RegEx.
 * @param email
 * @returns {boolean}
 */
export function validateEmailRegex(email: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}
