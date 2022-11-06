/**
 * Create or update the users username
 * @example {
 *  "username": "tester"
 * }
 */
export interface PutUsernameRequest {
    /**
     * The user's username
     * @example "tester"
     * @minLength 6
     * @maxLength 40
     */
    username: string;
}
