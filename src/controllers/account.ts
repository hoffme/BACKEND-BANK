import { NextFunction, Request, Response } from "express";

import Controller from "./controller";

class AccountController extends Controller {
  public static profile(req: Request, res: Response, next: NextFunction) {
    this.sendJSON(res, { ...req.access.user });
  }

  public static home(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const from = new Date();
      const to = new Date();

      from.setFullYear(to.getFullYear(), to.getMonth(), to.getDate() - 7);

      const fromTransfersResult = await this.adapters.stores.transfer.Search({
        fromUserId: req.access.user.id,
        orderBy: "date",
        orderAsc: false,
        minDate: from.getTime(),
        maxDate: to.getTime(),
      });

      const toTransfersResult = await this.adapters.stores.transfer.Search({
        toUserId: req.access.user.id,
        orderBy: "date",
        orderAsc: false,
        minDate: from.getTime(),
        maxDate: to.getTime(),
      });

      const cardsResult = await this.adapters.stores.card.Search({
        userId: req.access.user.id,
        orderBy: "number",
        orderAsc: false,
      });

      const result = {
        from: from.getTime(),
        to: to.getTime(),
        cards: cardsResult.cards,
        transfers: [
          ...toTransfersResult.transfers,
          ...fromTransfersResult.transfers,
        ],
      };

      this.sendJSON(res, result);
    });
  }
}

export default AccountController;
