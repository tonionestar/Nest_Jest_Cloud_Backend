import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
} from "../../../classes/Common";
import {
    validateCompanyForenameSurename,
    validateStreetStateStreetnumber
} from "../../../logic/optionalValuesValidation";
import { AuditQueries } from "../../../database/query/AuditQueries";
import { BillingQueries } from "../../../database/query/BillingQueries";
import Country from "../../../classes/Country";
import { CountryRecord } from "../../../models/Country";
import { GetBillingResponseData } from "../../../models/billing/GetBillingResponse";
import { PutBillingRequest } from "../../../models/billing/PutBillingRequest";
import { PutBillingResponseData } from "../../../models/billing/PutBillingResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserBilling } from "../../../models/UserBilling";
import { UserIdNotFoundError } from "@clippic/clippic-errors";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class BillingLogic {
    private billingQueries: BillingQueries;
    private auditQueries: AuditQueries;
    private usersQueries: UsersQueries;

    private req: RequestTracing;
    private traceId: string;


    private user: User = {};
    private userBilling: UserBilling;

    constructor(req: RequestTracing, id: string, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = id;
        this.billingQueries = new BillingQueries(parentSpanContext);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
    }

    public async getUsersBillingLogic(): Promise<GetBillingResponseData> {
        await this.checkRouteAccess();

        await this.getUsersBilling();

        if (this.isBillingNotFound()) {
            throw new UserIdNotFoundError(this.user.id, this.traceId);
        }

        const country = this.getCountry();
        return {
            "company": this.userBilling.company,
            "forename": this.userBilling.forename,
            "surname": this.userBilling.surname,
            "box": this.userBilling.box,
            "street": this.userBilling.street,
            "streetNumber": this.userBilling.streetNumber,
            "zip": this.userBilling.zip,
            "city": this.userBilling.city,
            "state": this.userBilling.state,
            "countryISO2": country.iso2,
            "countryISO3": country.iso3,
            "countryName": country.name,
        };
    }

    public async putUsersBillingLogic(body: PutBillingRequest): Promise<PutBillingResponseData> {
        await this.checkRouteAccess();

        this.checkSemiOptionalValues(body);
        await this.CreateOrUpdateBilling(body);
        await this.updateAuditTimestamp();
        const country = await this.getCountry();
        return {
            "company": this.userBilling.company,
            "forename": this.userBilling.forename,
            "surname": this.userBilling.surname,
            "box": this.userBilling.box,
            "street": this.userBilling.street,
            "streetNumber": this.userBilling.streetNumber,
            "zip": this.userBilling.zip,
            "city": this.userBilling.city,
            "state": this.userBilling.state,
            "countryISO2": country.iso2,
            "countryISO3": country.iso3,
            "countryName": country.name,
        };
    }


    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersBilling() {
        const result = await this.billingQueries.GetBilling(this.user.id);
        this.userBilling = { ...result };
    }

    private getCountry(): CountryRecord {
        const countryId = this.userBilling.country;
        const allCountries = new Country();
        return allCountries.getCountryById(countryId);
    }

    private isBillingNotFound() {
        return Object.keys(this.userBilling).length == 0;
    }

    private checkSemiOptionalValues(billingRequestData: PutBillingRequest) {
        validateCompanyForenameSurename(billingRequestData, this.traceId);
        validateStreetStateStreetnumber(billingRequestData, this.traceId);
    }

    private async CreateOrUpdateBilling(billingRequestData: PutBillingRequest): Promise<void> {
        const result = await this.billingQueries.CreateOrUpdateBilling(this.user.id, billingRequestData);
        this.userBilling = { ...result };
    }

    private async updateAuditTimestamp() {
        return this.auditQueries.UpdateAuditBilling(this.user.id);
    }

}
