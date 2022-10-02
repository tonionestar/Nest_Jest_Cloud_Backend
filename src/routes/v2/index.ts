import { Controller, Delete, Get, Patch, Post, Put, Response, Route, Tags } from "tsoa";

@Route("")
export class IndexController extends Controller {


  private notAllowed(): Promise<string> {
    this.setStatus(403);
    return Promise.resolve("Not allowed")
  }

  /**
   * This routes are sending a '403 - Not allowed' for all methods on '/'.
   */
  @Tags("Index")
  @Response(403, "Not allowed")
  @Get("/")
  public async getNotAllowed() {
    return this.notAllowed();
  }

  @Tags("Index")
  @Response(403, "Not allowed")
  @Post("/")
  public async postNotAllowed() {
    return this.notAllowed();
  }

  @Tags("Index")
  @Response(403, "Not allowed")
  @Put("/")
  public async putNotAllowed() {
    return this.notAllowed();
  }

  @Tags("Index")
  @Response(403, "Not allowed")
  @Patch("/")
  public async patchNotAllowed() {
    return this.notAllowed();
  }

  @Tags("Index")
  @Response(403, "Not allowed")
  @Delete("/")
  public async deleteNotAllowed(): Promise<string> {
    return this.notAllowed();
  }
}
