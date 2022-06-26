import { NextFunction, Request, Response } from "express";

import Controller from "./controller";

class ContactsController extends Controller {
  public static search(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const query = req.query.query?.toString();
      const limit = req.query.limit
        ? parseInt(req.query.limit.toString()) || undefined
        : undefined;
      const start = req.query.start
        ? parseInt(req.query.start.toString()) || undefined
        : undefined;

      console.log(req.query);

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
