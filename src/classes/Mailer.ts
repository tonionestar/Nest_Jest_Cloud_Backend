import { MailFormatError } from "@clippic/clippic-errors";
import { RequestTracing } from "../models/RequestTracing";

import express from "express";
import { getTraceId } from "./Common";

export function validateEmail(email: string, traceId: string): void {
    const emailIsInvalid = !validateEmailRegex(email);
    if (emailIsInvalid) {
        throw new MailFormatError(email, traceId);
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
