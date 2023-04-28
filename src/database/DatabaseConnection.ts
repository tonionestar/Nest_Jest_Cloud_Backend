import { DataSource } from "typeorm";


let ClippicDataSource: DataSource;
let synchronizeDatabase = false;

if (process.env.DATABASE_SYNCHRONIZE == "true" || process.env.DATABASE_SYNCHRONIZE) {
    synchronizeDatabase = true;
    console.log("Data Source has been synchronized");
}


const MariadbDataSource = new DataSource({
    type: "mariadb",
    host: process.env.DATABASE_SERVER,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        __dirname + "/../**/entity/*{.js,.ts}",
    ],
    synchronize: synchronizeDatabase,
});

const LocalDataSource = new DataSource ({
    type: "mariadb",
    host: "127.0.0.1",
    port: 3306,
    username: "jest",
    password: "jest",
    database: "users",
    entities: [
        __dirname + "/../**/entity/*{.js,.ts}",
    ],
    logging: false,
    synchronize: true
});

if (process.env.NODE_ENV === "jest" || process.env.NODE_ENV === "dev") {
    ClippicDataSource = LocalDataSource;
} else {
    ClippicDataSource = MariadbDataSource;
}

export {
    ClippicDataSource
};
