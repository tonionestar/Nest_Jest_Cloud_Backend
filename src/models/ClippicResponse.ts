export interface ClippicResponse {
    /**
     * Respose status, either "error" or "success"
     */
    status: string;

    /**
     * Custom response message.
     */
    message?: string;

    data?: unknown;

    /**
     * HTTP code or custom error code.
     * @isInt
     */
    code: number;

    /**
     * OpenTracing tracing id for request.
     */
    trace: string;
}
