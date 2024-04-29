import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/entities/user";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper";
import { prisma } from "@/lib/prisma";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  return User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );
}

export class UserFactory {
  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
