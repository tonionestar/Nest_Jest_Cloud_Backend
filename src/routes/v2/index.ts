// 3rd party modules
import * as express from "express";

class IndexController {
  public path = "/";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.sendNotAllowed);
    this.router.post(this.path, this.sendNotAllowed);
    this.router.patch(this.path, this.sendNotAllowed);
    this.router.put(this.path, this.sendNotAllowed);
    this.router.delete(this.path, this.sendNotAllowed);
  }

  sendNotAllowed = (request: express.Request, response: express.Response) => {
    response.status(403).send('<pre>Not allowed</pre>');
  }
}

export default IndexController;
