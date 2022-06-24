type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

type JWTClaim = { [key: string]: JSONValue };

interface CryptoAdapter {
  uuid(): Promise<string>;
  passwordEncrypt(password: string): Promise<string>;
  passwordVerify(hash: string, password: string): Promise<boolean>;
  jwtEncode<T extends JWTClaim>(data: T, expiresIn: number): Promise<string>;
  jwtDecode<T extends JWTClaim>(token: string): Promise<T>;
}

export type { CryptoAdapter, JSONValue, JWTClaim };
