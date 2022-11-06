/**
 * Create or update the users surname
 * @example {
 *  "surname": "tester"
 * }
 */
export interface PutSurnameRequest {
    /**
     * The user's surname
     * @example "tester"
     * @minLength 1
     * @maxLength 100
     */
    surname: string;
}
