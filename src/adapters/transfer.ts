interface TransferCardUser {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

interface TransferCard {
  id: string;
  user: TransferCardUser;
  number: string;
  type: string;
}

interface Transfer {
  id: string;
  label: string;
  from: TransferCard;
  to: TransferCard;
  value: number;
  date: number;
}

interface TransferSearchFilter {
  label?: string;
  fromUserId?: string;
  toUserId?: string;
  fromCardId?: string;
  toCardId?: string;
  minValue?: number;
  maxValue?: number;
  minDate?: number;
  maxDate?: number;
  start?: number;
  limit?: number;
  orderBy?: "value" | "date";
  orderAsc?: boolean;
}

interface TransferSearchResult {
  transfers: Transfer[];
  start: number;
  limit: number;
  total: number;
}

interface TransferStoreAdapter {
  FindById(id: string): Promise<Transfer | null>;
  Search(filter: TransferSearchFilter): Promise<TransferSearchResult>;
  Create(transfer: Transfer): Promise<void>;
  Update(transfer: Transfer): Promise<void>;
  Delete(transfer: Transfer): Promise<void>;
}

export type {
  Transfer,
  TransferSearchFilter,
  TransferSearchResult,
  TransferStoreAdapter,
};
