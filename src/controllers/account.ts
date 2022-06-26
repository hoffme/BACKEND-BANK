import { NextFunction, Request, Response } from "express";

import Controller from "./controller";

class AccountController extends Controller {
  public static profile(req: Request, res: Response, next: NextFunction) {
    this.sendJSON(res, { ...req.access.user });
  }

  public static home(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const transfersFrom = await this.adapters.stores.transfer.Search({
        fromUserId: req.access.user.id,
        orderBy: "date",
        orderAsc: false,
        limit: 10,
      });

      const transfersTo = await this.adapters.stores.transfer.Search({
        toUserId: req.access.user.id,
        orderBy: "date",
        orderAsc: false,
        limit: 10,
      });

      const cards = await this.adapters.stores.card.Search({
        userId: req.access.user.id,
        orderBy: "number",
        orderAsc: false,
      });

      this.sendJSON(res, {
        transfers: {
          from: transfersFrom,
          to: transfersTo,
        },
        cards,
      });
    });
  }
}

export default AccountController;
