import { User } from "../entities/user";

export interface UsersRepository {
  create: (user: User) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
}
