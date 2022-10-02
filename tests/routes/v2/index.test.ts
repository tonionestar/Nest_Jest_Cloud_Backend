// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from "supertest"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../../../src/app")

describe("/", () => {

    it("should respond with 403 (GET)", async () => {
        const result = await request(app)
            .get("/");

        expect(result.status).toBe(403);
    })

    it("should respond with 403 (POST)", async () => {
        const result = await request(app)
            .post("/");

        expect(result.status).toBe(403);
    })

    it("should respond with 403 (PUT)", async () => {
        const result = await request(app)
            .put("/");

        expect(result.status).toBe(403);
    })

    it("should respond with 403 (PATCH)", async () => {
        const result = await request(app)
            .patch("/");

        expect(result.status).toBe(403);
    })

    it("should respond with 403 (DELETE)", async () => {
        const result = await request(app)
            .delete("/");

        expect(result.status).toBe(403);
    })

    it("should respond with \"not allowed\"", async () => {
        const result = await request(app)
            .get("/");

        expect(result.text).toBe("\"Not allowed\"")
    })
})
