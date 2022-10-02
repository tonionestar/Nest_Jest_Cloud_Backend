import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";

@Route("/health")
export class HealthController extends Controller {
  /**
   * This route is used for Health checks and is just returning '200' code.
   */

  @Tags("Health")
  @SuccessResponse("200", "")
  @Get("/")
  public async sendOK(): Promise<void> {
    this.setStatus(200);
    return Promise.resolve();
  }
}
