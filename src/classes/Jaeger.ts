import {
    initTracer as initJaegerTracer,
    opentracing
} from "jaeger-client";

function initTracer(serviceName: string) {

    const config = {
        serviceName: serviceName,
        sampler: {
            type: "const",
            param: 1
        },
        reporter: {
            collectorEndpoint: process.env.JAEGER_ENDPOINT,
            logSpans: false
        },
    };
    const options = {
        tags: {
            'user.version': process.env.npm_package_version,
        },
        logger: {
            info: function logInfo(msg: string) {
                console.log('INFO  ', msg);
            },
            error: function logError(msg: string) {
                console.log('ERROR ', msg);
            },
        },
    };
    return initJaegerTracer(config, options);
}

export default ( process.env.NODE_ENV === "jest" ) ? new opentracing.MockTracer : initTracer('user') as opentracing.Tracer;
