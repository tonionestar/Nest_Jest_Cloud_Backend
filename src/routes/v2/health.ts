// 3rd party modules
import * as express from "express";

class HealthController {
  public path = "/health"
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.sendOK);
  }

  sendOK = (request: express.Request, response: express.Response) => {
    response.status(200).send();
  }
}

export default HealthController;
