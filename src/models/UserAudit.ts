export interface UserAudit {
    /**
     * Stringified UUIDv4.
     * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
     * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
     * @format uuid
     */
    user_id: string;

    /**
     * When the user created the account
     * @format date
     */
    created: string;

    /**
     * When the user modified any of the tracked fields.
     * @format date
     */
    modified: string;

    /**
     * When the user modified his username.
     * @format date
     */
    username?: string;

    /**
     * When the user modified his forename.
     * @format date
     */
    forename?: string;

    /**
     * When the user modified his surname.
     * @format date
     */
    surname?: string;

    /**
     * When the user modified his email.
     * @format date
     */
    email?: string;

    /**
     * When the user modified his hash.
     * @format date
     */
    hash?: string;

    /**
     * When the user modified his billing data.
     * @format date
     */
    billing?: string;

    /**
     * When the user modified his shipping data.
     * @format date
     */
    shipping?: string;

    /**
     * When the user has change in quota.
     * @format date
     */
    quota?: string;
}
