import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { Adapters } from "../adapters/adapters";

abstract class Controller {
  private static _adapters: Adapters;

  public static get adapters(): Adapters {
    if (!this._adapters) throw new Error("adapters not defined");
    return this._adapters;
  }

  public static set adapters(adapter: Adapters) {
    this._adapters = adapter;
  }

  protected static sendJSON<T>(res: Response, result: T, code = 200) {
    res.status(code).json({ code, result });
  }

  protected static sendERROR<T>(res: Response, error: T, code = 500) {
    res.status(code).json({ code, error });
  }

  protected static zodBodyVerification<T>(
    req: Request,
    res: Response,
    verify: z.ZodSchema
  ): T | undefined {
    try {
      return verify.parse(req.body);
    } catch (e) {
      const error = e instanceof ZodError ? e.issues : "Invalid Params";
      this.sendERROR(res, error, 400);
    }
  }

  protected static wrpAsync(
    req: Request,
    res: Response,
    next: NextFunction,
    handler: () => Promise<void>
  ) {
    handler().catch((err) => {
      this.sendERROR(res, "Internal Error", 500);
      next(err);
    });
  }
}

export default Controller;
