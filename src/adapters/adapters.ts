import { CardsStoreAdapter } from "./cards";
import { CryptoAdapter } from "./crypto";
import { TransferStoreAdapter } from "./transfer";
import { UserStoreAdapter } from "./user";

interface Adapters {
  crypto: CryptoAdapter;
  stores: {
    user: UserStoreAdapter;
    card: CardsStoreAdapter;
    transfer: TransferStoreAdapter;
  };
}

export type { Adapters };
