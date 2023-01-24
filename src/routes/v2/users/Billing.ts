import * as express from "express";
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
import { UserBilling } from "../../../models/UserBilling";
import { GetBillingResponse } from "../../../models/forename/GetBillingResponse";
import { PutBillingRequest } from "../../../models/forename/PutBillingRequest";
import { PutBillingResponse } from "../../../models/forename/PutBillingResponse";
import { RequestTracing } from "../../../models/RequestTracing";
import { SpanContext } from "opentracing";
import { User } from "../../../models/User";
import { UserQueries } from "../../../database/query/UserQueries";

@Route("/v2/users/billing")
export class BillingController extends Controller {

    public router = express.Router();
    public db = new UserQueries();

    private req: RequestTracing;
    private traceId: string;
    private parentSpanContext: SpanContext;

    private user: User = {};
    private userBilling: UserBilling = {};

    private async getUsersSession() {
        const result = await this.db.doQuery(this.parentSpanContext, this.db.GetUsersSession, this.user.id);
        this.user = Object.assign(this.user, result);
    }

    private async updateModified() {

        // await this.db.doQuery(this.parentSpanContext, this.db.UpdateAuditBilling, this.user.id); @TODO
    }

    private async checkRouteAccess() {
        // check if user is allowed for this url
        checkJWTAuthenticationUserId(this.req, this.user);

        // get session from database
        await this.getUsersSession();

        // check if user has correct session variable
        checkJWTAuthenticationSession(this.req, this.user);
    }

    private async initialize(req: RequestTracing, id: string) {
        this.req = req;
        this.parentSpanContext = getTraceContext(req);
        this.traceId = getTraceId(req);
        this.user.id = id;

        await this.checkRouteAccess();
    }

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

        // Implement get logic here

        return Promise.resolve({
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
                "countryISO2": "@TODO",
                "countryISO3": "@TODO",
                "countryName": "@TODO",
            }],
            "code": 200,
            "trace": this.traceId
        });
    }
}
