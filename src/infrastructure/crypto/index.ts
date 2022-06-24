import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import { CryptoAdapter, JWTClaim } from "../../adapters/crypto";

class CryptoInfrastructure implements CryptoAdapter {
  private readonly passwordHashSalt: number = 10;
  private readonly jwtSecret: string = "shhhh";

  public async uuid(): Promise<string> {
    return uuidV4();
  }

  public async passwordEncrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, this.passwordHashSalt);
  }

  public async passwordVerify(
    hash: string,
    password: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  public async jwtEncode<T extends JWTClaim>(
    data: T,
    expiresIn: number
  ): Promise<string> {
    return jwt.sign(data, this.jwtSecret, { expiresIn });
  }

  public async jwtDecode<T extends JWTClaim>(token: string): Promise<T> {
    const data = jwt.decode(token);
    if (!data || typeof data === "string") throw new Error("invalid token");
    return data as T;
  }
}

export default CryptoInfrastructure;
