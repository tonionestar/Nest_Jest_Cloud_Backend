import express from "express";
import {opentracing} from "jaeger-client";


interface RequestTracing extends express.Request {
    span: opentracing.Span;
}

export default RequestTracing;