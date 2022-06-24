import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { Card, CardSearchFilter } from "../adapters/cards";
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
  public static getHandler(req: Request, res: Response, next: NextFunction) {
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

  public static searchHandler(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const filter: CardSearchFilter = SearchBodyVerify.parse(req.body);

      const result = await this.adapters.stores.card.Search(filter);

      this.sendJSON(res, result, 200);
    });
  }

  public static createHandler(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const params = CreateBodyVerify.parse(req.body);

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

  public static removeHandler(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const id = req.params.id;
      if (!id) {
        this.sendERROR(res, "invalid id");
        return;
      }

      const card = await this.adapters.stores.card.FindById(id);
      if (!card) {
        this.sendERROR(res, "card not found");
        return;
      }

      await this.adapters.stores.card.Delete(card);

      const result = { deleted: true };

      this.sendJSON(res, result, 200);
    });
  }
}

export default CardController;
