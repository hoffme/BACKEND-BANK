import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import Controller from "./controller";

const orderByEnum = {
  DNI: "dni",
  FirstName: "firstName",
  LastName: "lastName",
} as const;

const SearchBodyVerify = z.object({
  query: z.optional(z.string()),
  orderBy: z.optional(z.nativeEnum(orderByEnum)),
  orderAsc: z.optional(z.boolean()),
  company: z.optional(z.boolean()),
  start: z.optional(z.number().min(0)),
  limit: z.optional(z.number().min(0)),
});

class ContactsController extends Controller {
  public static search(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const filter = this.zodBodyVerification<z.infer<typeof SearchBodyVerify>>(
        req,
        res,
        SearchBodyVerify
      );
      if (!filter) return;

      const result = await this.adapters.stores.user.Search(filter);

      this.sendJSON(res, result, 200);
    });
  }
}

export default ContactsController;
