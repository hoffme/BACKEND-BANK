import { NextFunction, Request, Response } from "express";

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
    res.sendStatus(code).json({ code, result });
  }

  protected static sendERROR<T>(res: Response, error: T, code = 500) {
    res.sendStatus(code).json({ code, error });
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
