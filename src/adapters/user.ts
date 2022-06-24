interface User {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  hashPassword: string;
}

interface UserSearchFilter {
  query?: string;
  start?: number;
  limit?: number;
  orderBy?: "dni" | "firstName" | "lastName";
  orderAsc?: boolean;
}

interface UserSearchResult {
  users: User[];
  start: number;
  limit: number;
  total: number;
}

interface UserStoreAdapter {
  FindById(id: string): Promise<User | null>;
  FindByDNI(dni: string): Promise<User | null>;
  Search(filter: UserSearchFilter): Promise<UserSearchResult>;
  Create(user: User): Promise<void>;
  Update(user: User): Promise<void>;
  Delete(user: User): Promise<void>;
}

export type { User, UserSearchFilter, UserSearchResult, UserStoreAdapter };
