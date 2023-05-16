import {
    checkJWTAuthenticationSession,
    getUserIdFromJWTToken,
} from "../../../classes/Common";
import { ShippingType, UsersShipping } from "../../../database/entity/UsersShipping";
import {
    validateCompanyForenameSurename, validatePackstation,
    validateStreetStateStreetnumber,
    validateZipCityCountry
} from "../../../logic/optionalValuesValidation";
import { AuditQueries } from "../../../database/query/AuditQueries";
import Country from "../../../classes/Country";
import { CountryRecord } from "../../../models/Country";
import { PostShippingRequest } from "../../../models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../../../models/shipping/PutShippingRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { ShippingNotFoundError } from "@clippic/clippic-errors";
import { ShippingQueries } from "../../../database/query/ShippingQueries";
import { ShippingResponseData } from "../../../models/shipping/ShippingResponse";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UsersQueries } from "../../../database/query/UsersQueries";

export class ShippingLogic {

    private shippingQueries: ShippingQueries;
    private auditQueries: AuditQueries;
    private usersQueries: UsersQueries;

    private req: RequestTracing;
    private traceId: string;
    private user: User = {};
    private userShippings: ShippingResponseData[];

    constructor(req: RequestTracing, parentSpanContext: SpanContext, traceId: string) {
        this.req = req;
        this.traceId = traceId;
        this.user.id = getUserIdFromJWTToken(req);
        this.auditQueries = new AuditQueries(parentSpanContext);
        this.usersQueries = new UsersQueries(parentSpanContext);
        this.shippingQueries = new ShippingQueries(parentSpanContext);
    }

    public async getShippingLogic(shippingId?: string) {
        await this.checkRouteAccess();
        if (shippingId) {
            await this.getShippingById(shippingId);
        } else {
            await this.getAllUserShippings();
        }
        return this.userShippings;
    }

    public async postShippingLogic( body: PostShippingRequest) {
        await this.checkRouteAccess();
        this.checkSemiOptionalValues(body);
        await this.createShipping(body);
        await this.updateAuditTimestamp();
        return this.userShippings;
    }

    public async putShippingLogic(body: PutShippingRequest) {
        await this.checkRouteAccess();
        await this.updateShipping(body);
        await this.updateAuditTimestamp();
        return this.userShippings;
    }

    private async checkRouteAccess() {
        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async getUsersSession() {
        const result = await this.usersQueries.GetUsersSession(this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async getShippingById(shippingId: string): Promise<void> {
        const shippings: UsersShipping[] = await this.shippingQueries.GetShippingById(shippingId);
        if (shippings.length == 0) {
            throw new ShippingNotFoundError(shippingId, this.traceId);
        }
        this.userShippings = [this.prepareShippingResponse(shippings[0])];
    }

    private async getAllUserShippings(): Promise<void> {
        const shippings: UsersShipping[] = await this.shippingQueries.GetShippings(this.user.id);
        this.userShippings = shippings.map((shipping) => this.prepareShippingResponse(shipping));
    }

    private checkSemiOptionalValues(shippingRequestData: PostShippingRequest) {
        if (shippingRequestData.shippingType == ShippingType.ADDRESS) {
            validateZipCityCountry(shippingRequestData, this.traceId);
            validateCompanyForenameSurename(shippingRequestData, this.traceId);
            validateStreetStateStreetnumber(shippingRequestData, this.traceId);
        } else {
            validatePackstation(shippingRequestData, this.traceId);
        }
    }

    private async createShipping(shippingRequestData: PostShippingRequest) {
        const newShipping = await this.shippingQueries.CreateShipping(this.user.id, shippingRequestData);
        this.userShippings = [this.prepareShippingResponse(newShipping)];
    }

    private async updateShipping(shippingRequestData: PutShippingRequest): Promise<void> {
        const shipping = await this.shippingQueries.UpdateShipping(this.user.id, shippingRequestData);
        if (!shipping) {
            throw new ShippingNotFoundError(shippingRequestData.id, this.traceId);
        }
        this.userShippings = [this.prepareShippingResponse(shipping)];
    }

    private prepareShippingResponse(shipping: UsersShipping): ShippingResponseData {
        const country = shipping.country ? this.getCountry(shipping.country) : null;
        delete shipping.country;
        return {
            ...shipping,
            "countryISO2": country?.iso2 || null,
            "countryISO3": country?.iso3 || null,
            "countryName": country?.name || null,
        };
    }

    private getCountry(countryId: number): CountryRecord {
        const allCountries = new Country();
        return allCountries.getCountryById(countryId);
    }

    private async updateAuditTimestamp() {
        return this.auditQueries.UpdateAuditShipping(this.user.id);
    }
}
