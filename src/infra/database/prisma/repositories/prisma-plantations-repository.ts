import { PlantationsRepository } from "@/domain/repositories/plantations-repository";
import { Plantation } from "@/domain/entities/plantation";
import { PrismaPlantationMapper } from "../mappers/prisma-plantation-mapper";
import { prisma } from "@/lib/prisma";

export class PrismaPlantationsRepository implements PlantationsRepository {
  async create(plantation: Plantation): Promise<void> {
    const data = PrismaPlantationMapper.toPrisma(plantation);

    await prisma.plantation.create({
      data,
    });
  }

  async findByTitle(title: string): Promise<Plantation | null> {
    const plantation = await prisma.plantation.findUnique({
      where: {
        title,
      },
    });

    if (!plantation) {
      return null;
    }

    return PrismaPlantationMapper.toDomain(plantation);
  }
}
