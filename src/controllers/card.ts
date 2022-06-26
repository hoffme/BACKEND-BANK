import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { Card } from "../adapters/cards";
import Controller from "./controller";

const orderByEnum = {
  Number: "number",
  Type: "type",
  Balance: "balance",
} as const;

const typeByEnum = {
  Visa: "visa",
  Mastercard: "mastercard",
} as const;

const SearchBodyVerify = z.object({
  userId: z.optional(z.string()),
  orderBy: z.optional(z.nativeEnum(orderByEnum)),
  orderAsc: z.optional(z.boolean()),
  start: z.optional(z.number().min(0)),
  limit: z.optional(z.number().min(0)),
});

const CreateBodyVerify = z.object({
  type: z.nativeEnum(typeByEnum).default("visa"),
  balance: z.number().min(0).default(0),
  pin: z.string().length(3).default("000"),
});

class CardController extends Controller {
  public static get(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const cardId = req.params.id;
      if (!cardId) {
        this.sendERROR(res, new Error("not found"), 404);
        return;
      }

      const card = await this.adapters.stores.card.FindById(cardId);
      if (!card) {
        this.sendERROR(res, new Error("not found"), 404);
        return;
      }

      const result = { card };

      this.sendJSON(res, result, 200);
    });
  }

  public static search(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const filter = this.zodBodyVerification<z.infer<typeof SearchBodyVerify>>(
        req,
        res,
        SearchBodyVerify
      );
      if (!filter) return;

      const result = await this.adapters.stores.card.Search(filter);

      this.sendJSON(res, result, 200);
    });
  }

  public static create(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const params = this.zodBodyVerification<z.infer<typeof CreateBodyVerify>>(
        req,
        res,
        CreateBodyVerify
      );
      if (!params) return;

      const id = await this.adapters.crypto.uuid();
      const number = await this.adapters.stores.card.NewNumberCard();
      const user = req.access.user;
      const type = params.type;
      const balance = params.balance;
      const pin = params.pin;

      const card: Card = {
        id,
        user,
        type,
        number,
        balance,
        pin,
      };

      await this.adapters.stores.card.Create(card);

      const result = { card };

      this.sendJSON(res, result, 201);
    });
  }
}

export default CardController;
