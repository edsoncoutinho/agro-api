import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Plantation, PlantationProps } from "@/domain/entities/plantation";
import { PrismaPlantationMapper } from "@/infra/database/prisma/mappers/prisma-plantation-mapper";
import { prisma } from "@/lib/prisma";

export function makePlantation(
  override: Partial<PlantationProps> = {},
  id?: UniqueEntityID,
) {
  return Plantation.create(
    {
      title: faker.word.words(1),
      ...override,
    },
    id,
  );
}

export class PlantationFactory {
  async makePrismaPlantation(
    data: Partial<PlantationProps> = {},
  ): Promise<Plantation> {
    const plantation = makePlantation(data);

    await prisma.plantation.create({
      data: PrismaPlantationMapper.toPrisma(plantation),
    });

    return plantation;
  }
}
