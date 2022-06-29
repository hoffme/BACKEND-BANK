import {
  User,
  UserSearchFilter,
  UserSearchResult,
  UserStoreAdapter,
} from "../../../adapters/user";

class UserStoreMemory implements UserStoreAdapter {
  private readonly users: User[] = [];

  public async FindById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user ? { ...user } : null;
  }

  public async FindByDNI(dni: string): Promise<User | null> {
    const user = this.users.find((user) => user.dni === dni) || null;
    return user ? { ...user } : null;
  }

  public async Search(filter: UserSearchFilter): Promise<UserSearchResult> {
    const start = filter.start || 0;
    const limit = filter.limit || 20;

    const usersFiltered = this.users.filter((user) => {
      if (filter.query && user.dni.includes(filter.query)) return true;
      if (
        filter.query &&
        user.firstName.toLowerCase().includes(filter.query.toLowerCase())
      )
        return true;
      if (
        filter.query &&
        user.lastName.toLowerCase().includes(filter.query.toLowerCase())
      )
        return true;

      return false;
    });

    const usersSorted = usersFiltered.sort((a, b) => {
      switch (filter.orderBy) {
        case "dni":
          return filter.orderAsc
            ? b.dni.localeCompare(a.dni)
            : a.dni.localeCompare(b.dni);
        case "firstName":
          return filter.orderAsc
            ? b.firstName.localeCompare(a.firstName)
            : a.firstName.localeCompare(b.firstName);
        case "lastName":
          return filter.orderAsc
            ? b.lastName.localeCompare(a.lastName)
            : a.lastName.localeCompare(b.lastName);
      }
      return 0;
    });

    const usersLimited = usersSorted.slice(start, limit);

    const users = usersLimited.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      dni: user.dni,
      company: user.company,
    }));

    return {
      users,
      start,
      limit,
      total: usersSorted.length,
    };
  }

  public async Create(user: User): Promise<void> {
    this.users.push({ ...user });
  }

  public async Update(userUpdate: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === userUpdate.id);
    if (index < 0) throw new Error(`user not found with id ${userUpdate.id}`);

    this.users[index] = { ...userUpdate };
  }

  public async Delete(userDeleted: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === userDeleted.id);
    if (index < 0) throw new Error(`user not found with id ${userDeleted.id}`);

    this.users.splice(index, 1);
  }
}

export default UserStoreMemory;
