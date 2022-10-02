import express from "express";
import { opentracing } from "jaeger-client";


export interface RequestTracing extends express.Request {
    span: opentracing.Span;
}
