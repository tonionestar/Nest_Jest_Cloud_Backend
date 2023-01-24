/**
 * Create or update the user's billing address.
 * @example {
 *  "street": "Stargarder Str.",
 *  "streetNumber": "34",
 *  "zip": "45968",
 *  "city": "Gladbeck",
 *  "state": "North Rhine-Westphalia",
 *  "country": "DE"
 * }
 *
 * @example {
 *  "box": "PO 234",
 *  "zip": "45968",
 *  "city": "Gladbeck",
 *  "state": "North Rhine-Westphalia",
 *  "country": "DE"
 * }
 */
export interface PutBillingRequest {
    /**
     * Address zip code
     * @example "45968"
     * @maxLength 20
     */
    zip: string;

    /**
     * Address city
     * @example "Gladbeck"
     * @maxLength 50
     */
    city: string;

    /**
     * Address state
     * @example "North Rhine-Westphalia"
     * @maxLength 50
     */
    state?: string;

    /**
     * Address post office box
     * @example "PO 456"
     * @maxLength 50
     */
    box?: string;

    /**
     * Address street
     * @example "Stargarder Str."
     * @maxLength 50
     */
    street?: string;

    /**
     * Address house number
     * @example "34"
     * @maxLength 50
     */
    streetNumber?: string;

    /**
     * ISO2 or ISO3 representation of country
     * @example "DE"
     * @maxLength 3
     * @minLength 2
     */
    country: string;
}
