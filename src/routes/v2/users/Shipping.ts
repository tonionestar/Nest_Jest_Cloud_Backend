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
import { getTraceContext, getTraceId } from "../../../classes/Common";
import {
    ShippingResponse,
    ShippingResponseData
} from "../../../models/shipping/ShippingResponse";
import { PostShippingRequest } from "../../../models/shipping/PostShippingRequest";
import { PutShippingRequest } from "../../../models/shipping/PutShippingRequest";
import { RequestTracing } from "../../../models/RequestTracing";
import { ShippingLogic } from "../usersLogic/ShippingLogic";

@Route("/v2/users/shipping")
export class ShippingController extends Controller {

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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const shippingLogic = new ShippingLogic(req, id, parentSpanContext, traceId);
        const shippingDataResponse : ShippingResponseData[]= await shippingLogic.getShippingLogic(shippingId);

        return {
            "status": "success",
            "message": "",
            "data": shippingDataResponse,
            "code": 200,
            "trace": traceId
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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const shippingLogic = new ShippingLogic(req, id, parentSpanContext, traceId);
        const shippingDataResponse : ShippingResponseData[]= await shippingLogic.postShippingLogic(body);

        return {
            "status": "success",
            "message": "",
            "data": shippingDataResponse,
            "code": 200,
            "trace": traceId
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
        const parentSpanContext = getTraceContext(req);
        const traceId = getTraceId(req);
        const shippingLogic = new ShippingLogic(req, id, parentSpanContext, traceId);
        const shippingDataResponse : ShippingResponseData[]= await shippingLogic.putShippingLogic(body);

        return {
            "status": "success",
            "message": "",
            "data": shippingDataResponse,
            "code": 200,
            "trace": traceId
        };
    }


}
