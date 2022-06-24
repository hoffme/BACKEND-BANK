interface CardUser {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

interface Card {
  id: string;
  user: CardUser;
  number: string;
  type: string;
  pin: string;
  balance: number;
}

interface CardSearchFilter {
  userId?: string;
  orderBy?: "number" | "type" | "balance";
  orderAsc?: boolean;
  start?: number;
  limit?: number;
}

interface CardSearchResult {
  cards: Card[];
  start: number;
  limit: number;
  total: number;
}

interface CardsStoreAdapter {
  NewNumberCard(): Promise<string>;
  FindById(id: string): Promise<Card | null>;
  Search(filter: CardSearchFilter): Promise<CardSearchResult>;
  Create(card: Card): Promise<void>;
  Update(card: Card): Promise<void>;
  Delete(card: Card): Promise<void>;
}

export type { Card, CardSearchFilter, CardSearchResult, CardsStoreAdapter };
