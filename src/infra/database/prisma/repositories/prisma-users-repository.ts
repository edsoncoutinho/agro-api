import { UsersRepository } from "@/domain/repositories/users-repository";
import { User } from "@/domain/entities/user";
import { prisma } from "@/lib/prisma";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDamain(user);
  }

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({
      data,
    });

    return user;
  }
}
