import { ClippicResponse } from "../ClippicResponse";

export interface GetBillingResponse extends ClippicResponse{

    data: GetBillingResponseData[];
}

export interface GetBillingResponseData {

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
     * ISO2 representation of country, example: Germany
     * @example "DE"
     * @maxLength 2
     * @minLength 2
     */
    countryISO2: string;

    /**
     * ISO3 representation of country, example: Germany
     * @example "DEU"
     * @maxLength 3
     * @minLength 3
     */
    countryISO3: string;

    /**
     * Name of country in english
     * @example "Germany"
     */
    countryName: string;
}
