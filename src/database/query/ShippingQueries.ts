import { ClippicDataSource } from "../DatabaseConnection";
import Country from "../../classes/Country";
import { PostShippingRequest } from "../../models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../../models/shipping/PutShippingRequest";
import { Repository } from "typeorm";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { UsersShipping } from "../entity/UsersShipping";

export class ShippingQueries {
    private shippingRepository: Repository<UsersShipping>;
    private parentSpanContext: SpanContext;

    constructor(parentSpanContext?: SpanContext) {
        this.shippingRepository = ClippicDataSource.getRepository(UsersShipping);
        this.parentSpanContext = parentSpanContext;
    }
    @trace
    GetShippings(userId: string): Promise<UsersShipping[]> {
        return this.shippingRepository.findBy({ userId });
    }
    @trace
    GetShippingById(shippingId: string): Promise<UsersShipping[]> {
        return this.shippingRepository.findBy({ id: shippingId });
    }
    @trace
    CreateShipping(userId: string, shippingRequestData: PostShippingRequest): Promise<UsersShipping> {
        const entityShippingRequest = this.convertRequestToEntity(shippingRequestData);
        return this.shippingRepository.save(entityShippingRequest);
    }
    @trace
    async UpdateShipping(userId: string, shippingRequestData: PutShippingRequest): Promise<UsersShipping> {
        const entityShippingRequest = this.convertRequestToEntity(shippingRequestData);
        await this.shippingRepository.update(shippingRequestData.id, entityShippingRequest);
        return this.shippingRepository.findOneBy({ id: shippingRequestData.id });
    }


    private convertRequestToEntity(shippingRequestData: PostShippingRequest | PutShippingRequest): Partial<UsersShipping> {
        if (shippingRequestData.country) {
            const countryId = this.getCountryIdByIso(shippingRequestData.country);
            return { ...shippingRequestData, country: countryId };
        } else {
            const requestData: any = { ...shippingRequestData };
            return requestData;
        }
    }
    private getCountryIdByIso(iso: string): number {
        const allCountries = new Country();
        return iso.length == 2 ? allCountries.getIDFromISO2(iso) : allCountries.getIDFromISO3(iso);
    }

}
