import { NextFunction, Request, Response } from "express";

import Controller from "./controller";

class ContactsController extends Controller {
  public static search(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const query = req.params.query || undefined;
      const limit = parseInt(req.params.limit) || undefined;
      const start = parseInt(req.params.start) || undefined;

      const result = await this.adapters.stores.user.Search({
        query,
        limit,
        start,
      });

      this.sendJSON(res, result, 200);
    });
  }
}

export default ContactsController;
