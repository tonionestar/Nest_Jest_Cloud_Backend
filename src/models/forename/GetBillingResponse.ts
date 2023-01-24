import { ClippicResponse } from "../ClippicResponse";

export interface GetBillingResponse extends ClippicResponse{

    data: GetBillingResponseData[];
}

export interface GetBillingResponseData {

    /**
     * Forename/Prename
     * @example "Max"
     * @maxLength 100
     */
    forename: string;

    /**
     * Forename/Prename
     * @example "Max"
     * @maxLength 100
     */
    company: string;

    /**
     * Surname/Lastname
     * @example "Mustermann"
     * @maxLength 100
     */
    surname: string;

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
