import request from "supertest"
import {ClippicDataSource} from "../../../../src/database/DatabaseConnection";
import {Users} from "../../../../src/database/entity/Users";
const app: any = require("../../../../src/app")

beforeAll(async () => {
    await ClippicDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
});

afterAll(async () => {
    await ClippicDataSource.destroy();
})

beforeEach(async () => {
    await ClippicDataSource.synchronize();
});

afterEach(async () => {
    await ClippicDataSource.dropDatabase();
});

describe('users', () => {

    it('should be possible to login with email', async () => {
        await ClippicDataSource.createQueryBuilder().insert().into(Users).values({
            username: "tester",
            email: "tester@clippic.app",
            salt: "3f044014c4b85d9dea5c595a87497da8",
            hash: "9a7e8f9d70abe0200278298de8866c27393c6455b643c43e809353ffab472decf04e6c91720b0d259d28fd7dae64cc6bd863413b18479240129d586449a21fb9",
            forename: "Mr",
            surname: "Tester"
        }).execute();
        const result = await request(app)
            .post(`/users/login`)
            .send({
                "email": "tester@clippic.app",
                "pass": "Test123#"
            });

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("id");
        expect(result.body).toHaveProperty("email", "tester@clippic.app");
        expect(result.body).toHaveProperty("username", "tester");
        expect(result.body).toHaveProperty("forename", "Mr");
        expect(result.body).toHaveProperty("surname", "Tester");
    })
});
