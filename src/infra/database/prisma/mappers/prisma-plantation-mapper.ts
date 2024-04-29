import { Prisma, Plantation as PrismaPlantation } from "@prisma/client";
import { Plantation } from "@/domain/entities/plantation";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaPlantationMapper {
  static toDomain(raw: PrismaPlantation): Plantation {
    return Plantation.create(
      {
        title: raw.title,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    plantation: Plantation,
  ): Prisma.PlantationUncheckedCreateInput {
    return {
      id: plantation.id.toString(),
      title: plantation.title,
    };
  }
}
