import { Adapters } from "../adapters/adapters";
import CryptoInfrastructure from "./crypto";
import {
  CardStoreMemory,
  TransferStoreMemory,
  UserStoreMemory,
} from "./storage";

const buildInfrastructure = async (): Promise<Adapters> => {
  const adapters: Adapters = {
    crypto: new CryptoInfrastructure(),
    stores: {
      user: new UserStoreMemory(),
      card: new CardStoreMemory(),
      transfer: new TransferStoreMemory(),
    },
  };

  return adapters;
};

export default buildInfrastructure;
