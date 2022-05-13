import request from "supertest"

let app: any = require("../../../src/app")

describe('health', () => {

    it('should respond with 200', async () => {
        const result = await request(app)
            .get(`/health`);

        expect(result.status).toBe(200);
    })
})
