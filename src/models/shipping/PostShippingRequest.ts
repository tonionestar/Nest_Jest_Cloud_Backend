import { ShippingType } from "../../database/entity/UsersShipping";

/**
 * Update the user's shipping address.
 * @example {
 *  "id": "1",
 *  "name" :"Shipping name",
 *  "shippingType": "address",
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
 *  "id": "2",
 *  "name":"Shipping name",
 *  "shippingType": "packstation",
 *  "packstation: "RS 554",
 *  "postnumber": "588,
 * }
 */
export interface PostShippingRequest {

    /**
     * The users' id
     * @example "52907745-7672-470e-a803-a2f8feb52944"
     * @maxLength 36
     */
    userId: string;

    /**
     * Name
     * @example "shipping name"
     * @minLength 1
     * @maxLength 50
     */
    name: string;

    /**
     * Shipping type
     * @example "packstation"
     * @minLength 1
     */

    shippingType: ShippingType;

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
    zip?: string;

    /**
     * Address city
     * @example "Gladbeck"
     * @minLength 1
     * @maxLength 50
     */
    city?: string;

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
    country?: string;

    /**
     * Packstation box to dropoff/receive parcels
     * @example "packstation exp"
     * @maxLength 5
     * @minLength 2
     */
    packstation?: string;

    /**
     * Postnumber
     * @example "588"
     * @maxLength 15
     * @minLength 1
     */
    postnumber?: string;
}
