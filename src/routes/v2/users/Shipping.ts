import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Post,
    Put,
    Request,
    Response,
    Route,
    Security,
    Tags
} from "tsoa";
import {
    BodyFieldCombinationInvalidError,
    ShippingNotFoundError
} from "@clippic/clippic-errors";
import {
    checkJWTAuthenticationSession,
    checkJWTAuthenticationUserId,
    getTraceContext,
    getTraceId
} from "../../../classes/Common";
import {
    ShippingResponse,
    ShippingResponseData
} from "../../../models/shipping/ShippingResponse";
import {
    ShippingType,
    UsersShipping
} from "../../../database/entity/UsersShipping";
import {
    validateCompanyForenameSurename,
    validatePackstation,
    validateStreetStateStreetnumber,
    validateZipCityCountry
} from "../../../logic/optionalValuesValidation";

import Country from "../../../classes/Country";
import { CountryRecord } from "../../../models/Country";
import { PostShippingRequest } from "../../../models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../../../models/shipping/PutShippingRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/shipping")
export class ShippingController extends Controller {
    public db = new UserQueries();
    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;
    private user: User = {};
    private userShippings: ShippingResponseData[];

    /**
     * This request will return the user's shipping addresses.
     *
     * **Errors:**
     *
     * | Code | Description         |
     * |------|---------------------|
     * | 400  | ShippingNotFoundError |
     */
    @Tags("Shipping")
    @Example<ShippingResponse>({
        status: "success",
        message: "",
        data: [
            {
                "id": "123",
                "userId": "123",
                "name": "shipping name",
                "shippingType": "address",
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
                "company": null,
                "box": null,
                "packstation": null,
                "postnumber": null,
            },
            {
                "id": "123",
                "userId": "123",
                "name": "shipping name",
                "shippingType": "packstation",
                "forename": null,
                "surname": null,
                "street": null,
                "streetNumber": null,
                "zip": null,
                "city": null,
                "state": null,
                "countryISO2": "DE",
                "countryISO3": "DEU",
                "countryName": "Germany",
                "company": null,
                "box": null,
                "packstation": "packstation example",
                "postnumber": "123",
            }
        ],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Response<ShippingNotFoundError>(400)
    @Get("/")
    public async getShippingRequest(@Request() req: RequestTracing, @Header() id: string, @Header() shippingId?: string): Promise<ShippingResponse> {
        await this.initialize(req, id);

        if (shippingId) {
            await this.getShippingById(shippingId);
        } else {
            await this.getAllUserShippings();
        }

        return {
            "status": "success",
            "message": "",
            "data": this.userShippings,
            "code": 200,
            "trace": this.traceId
        };
    }

    /**
     * This request will add a new shipping address to an existing user.
     *
     * **Errors:**
     *
     * | Code | Description                      |
     * |------|----------------------------------|
     * | 400  | BodyFieldCombinationInvalidError |
     */
    @Tags("Shipping")
    @Example<ShippingResponse>({
        status: "success",
        message: "",
        data: [{
            "id": "123",
            "userId": "123",
            "name": "shipping name",
            "shippingType": "address",
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
            "company": null,
            "box": null,
            "packstation": null,
            "postnumber": null,
        }],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Response<BodyFieldCombinationInvalidError>(400)
    @Post("/")
    public async postShippingRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PostShippingRequest): Promise<ShippingResponse> {
        await this.initialize(req, id);
        this.checkSemiOptionalValues(body);
        await this.createShipping(body);
        await this.updateAuditTimestamp();

        return {
            "status": "success",
            "message": "",
            "data": this.userShippings,
            "code": 200,
            "trace": this.traceId
        };
    }

    /**
     * This request will update existing shipping address to existing user.
     *
     * **Errors:**
     *
     * | Code | Description                      |
     * |------|----------------------------------|
     * | 400  | ShippingNotFoundError |
     */
    @Tags("Shipping")
    @Example<ShippingResponse>({
        status: "success",
        message: "",
        data: [{
            "id": "123",
            "userId": "123",
            "name": "shipping name",
            "shippingType": "address",
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
            "company": null,
            "box": null,
            "packstation": null,
            "postnumber": null,
        }],
        code: 200,
        trace: "4ba373202a8e4807"
    })
    @Security("jwt")
    @Response<ShippingNotFoundError>(400)
    @Put("/")
    public async putShippingRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutShippingRequest): Promise<ShippingResponse> {
        await this.initialize(req, id);
        await this.updateShipping(body);
        await this.updateAuditTimestamp();

        return {
            "status": "success",
            "message": "",
            "data": this.userShippings,
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

    private async getShippingById(shippingId: string): Promise<void> {
        const shippings: UsersShipping[] = await this.db.doQuery(this.parentSpanContext, this.db.GetShippingById, shippingId);
        if (shippings.length == 0) {
            throw new ShippingNotFoundError(shippingId, this.traceId);
        }
        this.userShippings = [this.prepareShippingResponse(shippings[0])];
    }

    private async getAllUserShippings(): Promise<void> {
        const shippings: UsersShipping[] = await this.db.doQuery(this.parentSpanContext, this.db.GetShippings, this.user.id);
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
        const newShipping = await this.db.doQuery(this.parentSpanContext, this.db.CreateShipping.bind(this.db), this.user.id, shippingRequestData);
        this.userShippings = [this.prepareShippingResponse(newShipping)];
    }

    private async updateShipping(shippingRequestData: PutShippingRequest): Promise<void> {
        const shipping = await this.db.doQuery(this.parentSpanContext, this.db.UpdateShipping.bind(this.db), this.user.id, shippingRequestData);
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
        return this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditShipping, this.user.id);
    }
}
