/**
 * Update the users password.
 * @example {
 *  "pass": "Test1234#!"
 * }
 */
export interface PutPasswordRequest {
    /**
     * The user's password.
     * @example "Test1234#!"
     */
    pass: string;
}
