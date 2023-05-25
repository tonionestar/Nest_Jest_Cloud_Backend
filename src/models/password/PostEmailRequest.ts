/**
 * Update the users email
 * @example {
 *  "email": "testnew@clippic.app"
 * }
 */
export interface PostEmailRequest {
    /**
     * The user's email
     * @example "testnew@clippic.app"
     * @minLength 5
     * @maxLength 200
     * @type email
     */
    email: string;
}
