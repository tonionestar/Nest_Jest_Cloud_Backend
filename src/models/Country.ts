export interface CountryRecord {
    id: number,
    name: string,
    native: string,
    phone: string,
    continent: string,
    capital: string,
    currency: string,
    languages: string[],
    iso3?: string,
    iso2?: string
}
