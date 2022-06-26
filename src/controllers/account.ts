import { NextFunction, Request, Response } from "express";

import Controller from "./controller";

class AccountController extends Controller {
  public static profile(req: Request, res: Response, next: NextFunction) {
    this.sendJSON(res, { ...req.access.user });
  }

  public static home(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const fromTransfers = await this.adapters.stores.transfer.Search({
        fromUserId: req.access.user.id,
        orderBy: "date",
        orderAsc: false,
        limit: 10,
      });

      const toTransfers = await this.adapters.stores.transfer.Search({
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
        transfersReceived: toTransfers.transfers,
        transfersIssued: fromTransfers.transfers,
        cards: cards.cards,
      });
    });
  }
}

export default AccountController;
