// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../src/app");

describe("/health", () => {

    it("should respond with 200", async () => {
        const result = await request(app)
            .get("/health");

        expect(result.status).toBe(200);
    });
});
