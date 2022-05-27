// @ts-ignore
import request from "supertest"
import {ClippicDataSource} from "../../../../src/database/DatabaseConnection";
import {createNewUser, insertUser} from "../../../classes/CommonTests";
const app: any = require("../../../../src/app")

beforeAll(async () => {
    await ClippicDataSource.initialize()
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
        const testUserId = await createNewUser();

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "email": "tester@clippic.app",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(1)

        // check created
        expect(result.body.data[0]).toHaveProperty("created");
        expect(result.body.data[0].created).not.toBeNull();

        // check id
        expect(result.body.data[0]).toHaveProperty("id", testUserId);

        // check last_modified
        expect(result.body.data[0]).toHaveProperty("last_modified");
        expect(result.body.data[0].last_modified).not.toBeNull();

        // token
        expect(result.body.data[0]).toHaveProperty("token");
        expect(result.body.data[0].token).not.toBeNull();
    })

    it('should be possible to login with username', async () => {
        const testUserId = await createNewUser();

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(1)

        // check created
        expect(result.body.data[0]).toHaveProperty("created");
        expect(result.body.data[0].created).not.toBeNull();

        // check id
        expect(result.body.data[0]).toHaveProperty("id", testUserId);

        // check last_modified
        expect(result.body.data[0]).toHaveProperty("last_modified");
        expect(result.body.data[0].last_modified).not.toBeNull();

        // token
        expect(result.body.data[0]).toHaveProperty("token");
        expect(result.body.data[0].token).not.toBeNull();
    })

    it('should not be possible to login with wrong password', async () => {
        const testUserId = await createNewUser();

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester",
                "pass": "Test123#2"
            });

        console.log(result.body);

        expect(result.status).toBe(401);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1025);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();
    })

    it('should not be possible to login with non-existing user', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(401);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1025);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login when password missing', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester"
            });

        console.log(result.body);

        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1002);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login when username/email missing', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "password": "tester"
            });

        console.log(result.body);

        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1002);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login when username and email are provided', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "test",
                "email": "test@clippic.app",
                "pass": "tester"
            });

        console.log(result.body);

        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1049);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login with wrong formatted email', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "email": "tester",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(409);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1022);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();
        expect(result.body.message).toContain("tester")

    })

    it('should not be possible to login when no audit is in database', async () => {
        await insertUser();

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "email": "tester@clippic.app",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1028);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login with to long username', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "01234567890123456789012345678901234567890123456789",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(409);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1036);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login with to long email', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "01234567890123456789012345678901234567890123456789@test.de",
                "pass": "Test123#"
            });

        console.log(result.body);

        expect(result.status).toBe(409);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1036);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login with null password', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester@test.de",
                "pass": null
            });

        console.log(result.body);

        expect(result.status).toBe(409);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1031);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })

    it('should not be possible to login with to short password', async () => {

        const result = await request(app)
            .post(`/users/login`)
            .send({
                "username": "tester@test.de",
                "pass": ""
            });

        console.log(result.body);

        expect(result.status).toBe(409);
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0)

        expect(result.body).toHaveProperty("code");
        expect(result.body.code).toBe(1035);

        expect(result.body).toHaveProperty("message");
        expect(result.body.message).not.toBeNull();

    })
});
