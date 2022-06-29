interface User {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  company: boolean;
  hashPassword: string;
}

interface UserSafe {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  company: boolean;
}

interface UserSearchFilter {
  query?: string;
  start?: number;
  limit?: number;
  company?: boolean;
  orderBy?: "dni" | "firstName" | "lastName";
  orderAsc?: boolean;
}

interface UserSearchResult {
  users: UserSafe[];
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
