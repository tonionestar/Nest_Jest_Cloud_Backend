/**
 * Create a new user account.
 * @example {
 *  "email": "tester@clippic.app",
 *  "username": "tester",
 *  "pass": "Test1234#!"
 * }
 */
export interface PostSignupRequest {

    /**
     * The user's email address
     * @example "tester"
     * @maxLength 40
     */
    username: string,

    /**
     * The user's username
     * @example "tester@clippic.app"
     * @maxLength 200
     */
    email: string,

    /**
     * The user's password.
     * @example "Test1234#!"
     */
    pass: string
}
