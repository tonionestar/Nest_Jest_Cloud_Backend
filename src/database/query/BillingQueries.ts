import { ClippicDataSource } from "../DatabaseConnection";
import Country from "../../classes/Country";
import { PutBillingRequest } from "../../models/billing/PutBillingRequest";
import { Repository } from "typeorm";
import { SpanContext } from "opentracing";
import { trace } from "../../classes/Common";
import { UsersBilling } from "../entity/UsersBilling";

export class BillingQueries {
    private billingRepository: Repository<UsersBilling>;
    private parentSpanContext: SpanContext;

    constructor(parentSpanContext?: SpanContext) {
        this.billingRepository = ClippicDataSource.getRepository(UsersBilling);
        this.parentSpanContext = parentSpanContext;
    }

    @trace
    GetBilling(userId: string): Promise<UsersBilling> {
        return this.billingRepository.findOneBy({ userId });
    }

    @trace
    async CreateOrUpdateBilling(userId: string, billingRequestData: PutBillingRequest): Promise<UsersBilling> {
        const countryId = this.getCountryIdByIso(billingRequestData.country);
        await this.billingRepository.save({ userId, ...billingRequestData, country: countryId });
        return this.billingRepository.findOneBy({ userId });
    }

    private getCountryIdByIso(iso: string): number {
        const allCountries = new Country();
        return iso.length == 2 ? allCountries.getIDFromISO2(iso) : allCountries.getIDFromISO3(iso);
    }
}
