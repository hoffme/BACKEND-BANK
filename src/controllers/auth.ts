import { NextFunction, Request, Response } from "express";
import z from "zod";

import { JWTClaim } from "../adapters/crypto";
import Controller from "./controller";

interface AuthJWTClaims extends JWTClaim {
  user: {
    id: string;
    dni: string;
  };
}

interface AuthAccess {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
  };
}

const SignInBodyVerify = z.object({
  dni: z.string().min(6).max(9),
  password: z.string().min(4),
});

const SignUpBodyVerify = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dni: z.string().min(6).max(9),
  password: z.string().min(4),
});

class AuthController extends Controller {
  public static signUpHandler(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const params = SignUpBodyVerify.parse(req.body);

      const userWithSameDNI = await this.adapters.stores.user.FindByDNI(
        params.dni
      );
      if (userWithSameDNI) {
        this.sendERROR(res, `user with dni=${params.dni} already exist`, 400);
        return;
      }

      const hashPassword = await this.adapters.crypto.passwordEncrypt(
        params.password
      );

      const id = await this.adapters.crypto.uuid();

      await this.adapters.stores.user.Create({
        id: id,
        firstName: params.firstName,
        lastName: params.lastName,
        dni: params.dni,
        hashPassword: hashPassword,
      });

      const result = {
        user: {
          id: id,
          firstName: params.firstName,
          lastName: params.lastName,
          dni: params.dni,
        },
      };

      this.sendJSON(res, result, 201);
    });
  }

  public static signInHandler(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const params = SignInBodyVerify.parse(req.body);

      const user = await this.adapters.stores.user.FindByDNI(params.dni);
      if (!user) {
        this.sendERROR(res, "invalid dni or password", 400);
        return;
      }

      const samePassword = await this.adapters.crypto.passwordVerify(
        user.hashPassword,
        params.password
      );
      if (!samePassword) {
        this.sendERROR(res, "invalid dni or password", 400);
        return;
      }

      const expiresIn = 60 * 15; // 15 minutes

      const token = await this.adapters.crypto.jwtEncode<AuthJWTClaims>(
        { user: { id: user.id, dni: user.dni } },
        expiresIn
      );

      const result = { token };

      this.sendJSON(res, result, 200);
    });
  }
}

class AuthMiddleware extends Controller {
  public static access(req: Request, res: Response, next: NextFunction) {
    this.wrpAsync(req, res, next, async () => {
      const token = req.headers.authorization;
      if (!token) {
        this.sendERROR(res, "unauthorized", 401);
        next(new Error("unauthorized"));
        return;
      }

      const claims = await this.adapters.crypto.jwtDecode<AuthJWTClaims>(token);

      const user = await this.adapters.stores.user.FindById(claims.user.id);
      if (!user) {
        this.sendERROR(res, "unauthorized", 401);
        next(new Error("unauthorized"));
        return;
      }

      req.access = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          dni: user.dni,
        },
      };

      next();
    });
  }
}

export default AuthController;
export { AuthMiddleware };
export type { AuthAccess };
