import { UsersRepository } from "@/domain/repositories/users-repository";
import { User } from "@/domain/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User) {
    this.items.push(user);

    return user;
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null;
  }
}
