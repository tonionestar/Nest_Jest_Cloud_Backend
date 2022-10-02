/**
 * The user login request.
 * @example {
 *  "email": "tester@clippic.app",
 *  "pass": "Test1234#!"
 * }
 */
export interface PostLoginRequest {

    /**
     * The user's email address (mutual exclusive with username)
     * @example "tester"
     * @maxLength 40
     */
    username?: string,

    /**
     * The user's username (mutual exclusive with username)
     * @example "tester@clippic.app"
     * @maxLength 200
     */
    email?: string,

    /**
     * The users password.
     * @example "Test1234#!"
     */
    pass: string
}
