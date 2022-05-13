// 3rd party modules
import cors from "cors";
import express from "express";
import promBundle from "express-prom-bundle";

// Custom modules
import JaegerMiddleware from "./middleware/JaegerMiddleware";
import HealthController from "./routes/v2/health";
import IndexController from "./routes/v2";
import { ClippicDataSource } from "./database/DatabaseConnection";
import { LoginController } from "./routes/v2/users/Login";

// Express
const app = express();
let port: number = 3000;

function initializeTestEnvironment() {
    if (process.env.NODE_ENV == "test") {
        app.use(cors())
    }
}

function enableMetrics() {
    const metricsMiddleware = promBundle({includeMethod: true});
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

    if (process.env.hasOwnProperty("PORT")) {
        port = parseInt(process.env.PORT);
    }
}

function initializeControllers() {
    app.use("/", new HealthController().router);
    app.use("/", new IndexController().router);
    app.use("/", new LoginController().router);
}

async function initializeDatabaseConnection() {
    ClippicDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}

async function main() {
    initializeExpress();
    enableMetrics();
    enableTracing();
    initializeTestEnvironment();
    initializeControllers();
    // only start app when not running jest
    if (process.env.NODE_ENV != "jest") {
        await initializeDatabaseConnection();
        app.listen(port, () => {
            console.log(`Server started at http://0.0.0.0:${port}`);
        });
    }
}

main().then(r => {});

module.exports = app;
