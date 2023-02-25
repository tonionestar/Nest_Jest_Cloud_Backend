import { BodyFieldCombinationInvalidError } from "@clippic/clippic-errors";
import { PutBillingRequest } from "../models/billing/PutBillingRequest";
import { PostShippingRequest } from "../models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../models/shipping/PutShippingRequest";

export function validateZipCityCountry(requestData: PutBillingRequest | PostShippingRequest | PutShippingRequest, traceId: string) {
    if (!requestData.zip || !requestData.city || !requestData.country) {
        throw new BodyFieldCombinationInvalidError("zip,city and county are required when using address shipping method", traceId);
    }
}
export function validateCompanyForenameSurename(requestData: PutBillingRequest | PostShippingRequest | PutShippingRequest, traceId: string) {
    if (!requestData.company && !(requestData.forename && requestData.surname)) {
        throw new BodyFieldCombinationInvalidError("either company, or forename + surname are required", traceId);
    }
}

export function validateStreetStateStreetnumber(requestData: PutBillingRequest | PostShippingRequest | PutShippingRequest, traceId: string) {
    if (!(requestData.street && requestData.state && requestData.streetNumber) && !requestData.box) {
        throw new BodyFieldCombinationInvalidError("either box, or state, street and street number are required", traceId)
    }
}
export function validatePackstation(requestData: PostShippingRequest | PutShippingRequest, traceId: string) {
    if (!requestData.packstation || !requestData.postnumber) {
        throw new BodyFieldCombinationInvalidError("packstation and postnumber are required when using packstation shipping method", traceId)
    }
}