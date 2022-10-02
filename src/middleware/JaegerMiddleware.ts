import { FORMAT_HTTP_HEADERS,Tags } from "opentracing";

import { RequestTracing } from "../models/RequestTracing";

import express from "express";
import tracer from "../classes/Jaeger";

function JaegerMiddleware(request: RequestTracing, response: express.Response, next: any) {
    // set parent context if needed
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers);
    request.span = tracer.startSpan(`${request.method}: ${request.path}`, {
        childOf: parentSpanContext,
    });

    response.on("finish", function () {
        request.span.setTag(Tags.HTTP_STATUS_CODE, response.statusCode);
        // check HTTP status code
        request.span.setTag(Tags.ERROR, ((response.statusCode >= 500)));
        request.span.setTag("Exception", ((response.statusCode >= 299)));
        // close the span
        request.span.finish();
    });

    next();
}

export default JaegerMiddleware;
