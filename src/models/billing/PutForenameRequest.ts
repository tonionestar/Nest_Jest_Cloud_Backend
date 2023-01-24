/**
 * Create or update the users forename
 * @example {
 *  "username": "tester"
 * }
 */
export interface PutForenameRequest {
    /**
     * The user's forename
     * @example "tester"
     * @minLength 1
     * @maxLength 100
     */
    forename: string;
}
