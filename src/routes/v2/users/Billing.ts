import { ClippicError, UserIdNotFoundError } from "@clippic/clippic-errors";
import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Put,
    Request,
    Route,
    Security,
    Tags
} from "tsoa";

import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import Country from "../../../classes/Country";
import { CountryRecord } from "../../../models/Country";
import { UserBilling } from "../../../models/UserBilling";
import { GetBillingResponse } from "../../../models/billing/GetBillingResponse";
import { PutBillingRequest } from "../../../models/billing/PutBillingRequest";
import { PutBillingResponse } from "../../../models/billing/PutBillingResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/billing")
export class BillingController extends Controller {

    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};
    private userBilling: UserBilling;

    /**
     * This request will return the user's billing address.
     */
    @Tags("Billing")
    @Example<GetBillingResponse>({
        status: "success",
        message: "",
        data: [
            {
                "forename": "Max",
                "surname": "Mustermann",
                "street": "Stargarder Str.",
                "streetNumber": "34",
                "zip": "45968",
                "city": "Gladbeck",
                "state": "North Rhine-Westphalia",
                "countryISO2": "DE",
                "countryISO3": "DEU",
                "countryName": "Germany",
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Get("/")
    public async getBillingRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetBillingResponse> {
        await this.initialize(req, id);

        await this.getUsersBilling()

        if (this.isBillingNotFound()) {
            throw new UserIdNotFoundError(this.user.id, this.traceId);
        }

        const country = this.getCountry()

        return {
            "status": "success",
            "message": "",
            "data": [{
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
            }],
            "code": 200,
            "trace": this.traceId
        };
    }

    /**
     * This request will update or create if not exists the user's billing address.
     */
    @Tags("Billing")
    @Example<PutBillingResponse>({
        status: "success",
        message: "",
        data: [{
            "forename": "Max",
            "surname": "Mustermann",
            "street": "Stargarder Str.",
            "streetNumber": "34",
            "zip": "45968",
            "city": "Gladbeck",
            "state": "North Rhine-Westphalia",
            "countryISO2": "DE",
            "countryISO3": "DEU",
            "countryName": "Germany",
        }],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Put("/")
    public async putBillingRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutBillingRequest): Promise<PutBillingResponse> {
        await this.initialize(req, id);
        this.checkSemiOptionalValues(body)
        await this.CreateOrUpdateBilling(body);
        await this.updateAuditTimestamp()
        const country = await this.getCountry()

        return {
            "status": "success",
            "message": "",
            "data": [{
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
            }],
            "code": 200,
            "trace": this.traceId
        };
    }

    private async initialize(req: RequestTracing, id: string) {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.id = id;

        await this.checkRouteAccess();
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
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getUsersBilling() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetBilling, this.user.id);
        this.userBilling = { ...result };
    }

    private getCountry(): CountryRecord {
        const countryId = this.userBilling.country;
        const allCountries = new Country();
        return allCountries.getCountryById(countryId)
    }

    private checkSemiOptionalValues(billingRequestData: PutBillingRequest) {
        let errorsMsg = ""
        if (!billingRequestData.company && !(billingRequestData.forename && billingRequestData.surname)) {
            errorsMsg += "either company, or forename + surname are required "
        }
        if (!(billingRequestData.street && billingRequestData.state && billingRequestData.streetNumber) && !billingRequestData.box) {
            errorsMsg += "either box, or state, street and street number are required "
        }
        if (errorsMsg.length > 0) {
            throw new ClippicError({ message: errorsMsg, trace: this.traceId, code: 0 })
        }
    }

    private async CreateOrUpdateBilling(billingRequestData: PutBillingRequest): Promise<void> {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.CreateOrUpdateBilling.bind(this.db), this.user.id, billingRequestData);
        this.userBilling = { ...result };
    }

    private async updateAuditTimestamp() {
        return this.db.doQuery(this.parentSpanContext, this.db.updateAuditBilling, this.user.id);
    }

    private isBillingNotFound() {
        return Object.keys(this.userBilling).length == 0;
    }

}
