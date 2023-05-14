import {
    Body,
    Controller,
    Example,
    Get,
    Header,
    Put,
    Request,
    Response,
    Route,
    Security,
    Tags
} from "tsoa";
import {
    BodyFieldCombinationInvalidError,
    UserIdNotFoundError
} from "@clippic/clippic-errors";
import { getTraceContext, getTraceId } from "../../../classes/Common";
import { BillingLogic } from "../usersLogic/BillingLogic";
import { GetBillingResponse } from "../../../models/billing/GetBillingResponse";
import { PutBillingRequest } from "../../../models/billing/PutBillingRequest";
import { PutBillingResponse } from "../../../models/billing/PutBillingResponse";
import { RequestTracing } from "../../../models/RequestTracing";

@Route("/v2/users/billing")
export class BillingController extends Controller {

    /**
     * This request will return the user's billing address.
     *
     * **Errors:**
     *
     * | Code | Description         |
     * |------|---------------------|
     * | 400  | UserIdNotFoundError |
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
    @Response<UserIdNotFoundError>(400)
    @Get("/")
    public async getBillingRequest(@Request() req: RequestTracing, @Header() id: string): Promise<GetBillingResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const billingLogic = new BillingLogic(req, id, parentSpanContext, traceId);
        const billingDataResponse = await billingLogic.getUsersBillingLogic();

        return {
            "status": "success",
            "message": "",
            "data": [billingDataResponse],
            "code": 200,
            "trace": traceId
        };
    }

    /**
     * This request will update or create if not exists the user's billing address.
     *
     * **Errors:**
     *
     * | Code | Description                      |
     * |------|----------------------------------|
     * | 400  | BodyFieldCombinationInvalidError |
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
    @Response<BodyFieldCombinationInvalidError>(400)
    @Put("/")
    public async putBillingRequest(@Request() req: RequestTracing, @Header() id: string, @Body() body: PutBillingRequest): Promise<PutBillingResponse> {
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const billingLogic = new BillingLogic(req, id, parentSpanContext, traceId);
        const billingDataResponse = await billingLogic.putUsersBillingLogic(body);

        return {
            "status": "success",
            "message": "",
            "data": [billingDataResponse],
            "code": 200,
            "trace": traceId
        };
    }
}
