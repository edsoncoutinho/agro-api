import { FarmersRepository } from "@/domain/repositories/farmers-repository";
import { Farmer } from "@/domain/entities/farmer";
import { PrismaFarmerMapper } from "../mappers/prisma-farmer-mapper";
import { prisma } from "@/lib/prisma";
import { FarmerDetails } from "@/domain/entities/value-objects/farmer-details";
import { PrismaFarmerDetailsMapper } from "../mappers/prisma-farmer-details-mapper";
import { Dashboard } from "@/domain/entities/value-objects/dashboard";

export class PrismaFarmersRepository implements FarmersRepository {
  async findById(id: string): Promise<Farmer | null> {
    const farmer = await prisma.farmer.findUnique({
      where: {
        id,
      },
      include: {
        plantations: true,
      },
    });

    if (!farmer) {
      return null;
    }

    return PrismaFarmerMapper.toDamain(farmer);
  }

  async findDetailsById(id: string): Promise<FarmerDetails | null> {
    const farmer = await prisma.farmer.findUnique({
      where: {
        id,
      },
      include: {
        plantations: true,
      },
    });

    if (!farmer) {
      return null;
    }

    return PrismaFarmerDetailsMapper.toDomain(farmer);
  }

  async save(farmer: Farmer): Promise<Farmer> {
    const data = PrismaFarmerMapper.toPrisma(farmer);

    await prisma.farmer.update({
      where: {
        id: farmer.id.toString(),
      },
      data: {
        ...data,
        plantations: {
          set: farmer.plantations.map((plantation) => ({
            id: plantation.id.toString(),
          })),
        },
      },
    });

    return farmer;
  }

  async create(farmer: Farmer): Promise<Farmer> {
    const data = PrismaFarmerMapper.toPrisma(farmer);

    await prisma.farmer.create({
      data: {
        ...data,
        plantations: {
          connect: farmer.plantations.map((plantation) => ({
            id: plantation.id.toString(),
          })),
        },
      },
    });

    return farmer;
  }

  async delete(farmer: Farmer): Promise<void> {
    const data = PrismaFarmerMapper.toPrisma(farmer);

    await prisma.farmer.delete({
      where: {
        id: data.id,
      },
    });
  }

  async getDashboardData(): Promise<Dashboard> {
    const farmersCount = await prisma.farmer.count();
    const totalArea = await prisma.farmer.aggregate({
      _sum: {
        totalArea: true,
      },
    });
    const farmersByState = await prisma.farmer.groupBy({
      by: ["state"],
      _count: {
        state: true,
      },
    });

    const farmersByPlantation = await prisma.plantation.findMany({
      select: {
        title: true,
        _count: {
          select: {
            farmers: true,
          },
        },
      },
    });

    const areas = await prisma.farmer.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    });

    return Dashboard.create({
      farmers: farmersCount,
      totalArea: totalArea._sum.totalArea || 0,
      farmersByState: farmersByState.map((farmer) => ({
        state: farmer.state,
        farmers: farmer._count.state,
      })),
      farmersByPlantation: farmersByPlantation.map((plantation) => ({
        plantation: plantation.title,
        farmers: plantation._count.farmers,
      })),
      farmersByArableAndVegetationArea: {
        arableArea: areas._sum.arableArea || 0,
        vegetationArea: areas._sum.vegetationArea || 0,
      },
    });
  }
}
