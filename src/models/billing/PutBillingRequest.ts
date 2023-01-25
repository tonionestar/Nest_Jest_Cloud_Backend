/**
 * Create or update the user's billing address.
 * @example {
 *  "forename": "Max",
 *  "surname": "Mustermann",
 *  "street": "Stargarder Str.",
 *  "streetNumber": "34",
 *  "zip": "45968",
 *  "city": "Gladbeck",
 *  "state": "North Rhine-Westphalia",
 *  "country": "DE"
 * }
 *
 * @example {
 *  "company:": "tabs vs. spaces UG",
 *  "box": "PO 234",
 *  "zip": "45968",
 *  "city": "Gladbeck",
 *  "state": "North Rhine-Westphalia",
 *  "country": "DE"
 * }
 */
export interface PutBillingRequest {

    /**
     * Company
     * @example "tabs vs. spaces UG"
     * @maxLength 150
     */
    company?: string;

    /**
     * Forename/Prename
     * @example "Max"
     * @maxLength 100
     */
    forename?: string;

    /**
     * Surname/Lastname
     * @example "Mustermann"
     * @maxLength 100
     */
    surname?: string;

    /**
     * Address zip code
     * @example "45968"
     * @minLength 1
     * @maxLength 20
     */
    zip: string;

    /**
     * Address city
     * @example "Gladbeck"
     * @minLength 1
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
     * @maxLength 150
     */
    street?: string;

    /**
     * Address house number
     * @example "34"
     * @maxLength 20
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
