import {
    ClippicError,
    ValidationError
} from "@clippic/clippic-errors";
import express, {
    NextFunction,
    Response,
} from "express";

import { ClippicDataSource } from "./database/DatabaseConnection";
import cors from "cors";
import { getTraceId } from "./classes/Common";
import JaegerMiddleware from "./middleware/JaegerMiddleware";
import promBundle from "express-prom-bundle";
import { RegisterRoutes } from "./routes";
import { RequestTracing } from "./models/RequestTracing";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "@tsoa/runtime";

// Express
const app = express();
let port = 3000;

function initializeTestEnvironment() {
    if (process.env.NODE_ENV == "test") {
        app.use(cors());
    }
}

function enableMetrics() {
    const metricsMiddleware = promBundle({ includeMethod: true });
    app.use(metricsMiddleware);
}

function enableTracing() {
    if (process.env.NODE_ENV != "jest") {
        app.use(JaegerMiddleware);
    }
}

function initializeExpress() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    if (Object.prototype.hasOwnProperty.call(process.env, "PORT")) {
        port = parseInt(process.env.PORT);
    }
}

async function initializeDatabaseConnection() {
    ClippicDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized");
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err);
        });
}

function errorHandler(
    err: unknown,
    req: RequestTracing,
    res: Response,
    next: NextFunction
): Response | void {
    if (err instanceof ClippicError) {
        return res.status(400).json(err.toJSON());
    }
    else if (err instanceof ValidateError) {
        return res.status(400).json(new ValidationError([err.fields], getTraceId(req)));
    }
    // console.error(err);
    next();
}

function initializeSwaggerUi() {
    app.use("/v2/users/public", express.static("public"));
    app.use(
        "/v2/users/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: "/v2/users/public/swagger.json",
            },
        })
    );
    RegisterRoutes(app);

    app.use(errorHandler);
}

async function main() {
    initializeExpress();
    enableMetrics();
    enableTracing();
    initializeTestEnvironment();
    // only start app when not running jest
    if (process.env.NODE_ENV != "production") {
        initializeSwaggerUi();
    }
    if (process.env.NODE_ENV != "jest") {
        await initializeDatabaseConnection();
        app.listen(port, () => {
            console.log(`Server started at http://0.0.0.0:${port}`);
        });
    }
}

main().then();

module.exports = app;
