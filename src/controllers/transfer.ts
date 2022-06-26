import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { Transfer } from "../adapters/transfer";
import Controller from "./controller";

const orderByEnum = {
  Value: "value",
  Date: "date",
} as const;

const SearchBodyVerify = z.object({
  fromUserId: z.optional(z.string()),
  toUserId: z.optional(z.string()),
  fromCardId: z.optional(z.string()),
  toCardId: z.optional(z.string()),
  minValue: z.optional(z.number().min(0)),
  maxValue: z.optional(z.number().min(0)),
  minDate: z.optional(z.number().min(0)),
  maxDate: z.optional(z.number().min(0)),
  orderBy: z.optional(z.nativeEnum(orderByEnum)),
  orderAsc: z.optional(z.boolean()),
  start: z.optional(z.number().min(0)),
  limit: z.optional(z.number().min(0)),
});

const CreateBodyVerify = z.object({
  from_id: z.string(),
  to_id: z.string(),
  value: z.number(),
});

class TransferController extends Controller {
  public static get(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const transferId = req.params.id;
      if (!transferId) {
        this.sendERROR(res, new Error("not found"), 404);
        return;
      }

      const transfer = await this.adapters.stores.transfer.FindById(transferId);
      if (!transfer) {
        this.sendERROR(res, new Error("not found"), 404);
        return;
      }

      const result = { transfer };

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

      const result = await this.adapters.stores.transfer.Search(filter);

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

      const cardFrom = await this.adapters.stores.card.FindById(params.from_id);
      if (!cardFrom) {
        this.sendERROR(res, "not found card from", 404);
        return;
      }

      const cardTo = await this.adapters.stores.card.FindById(params.to_id);
      if (!cardTo) {
        this.sendERROR(res, "not found card to", 404);
        return;
      }

      const id = await this.adapters.crypto.uuid();
      const date = new Date().getTime();
      const value = params.value;

      const transfer: Transfer = {
        id,
        from: cardFrom,
        to: cardTo,
        date,
        value,
      };

      await this.adapters.stores.transfer.Create(transfer);

      const result = { transfer };

      this.sendJSON(res, result, 201);
    });
  }
}

export default TransferController;
