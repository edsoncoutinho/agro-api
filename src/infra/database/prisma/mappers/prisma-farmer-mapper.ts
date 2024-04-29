import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Farmer } from "@/domain/entities/farmer";
import { Farmer as PrismaFarmer, Prisma } from "@prisma/client";

export class PrismaFarmerMapper {
  static toDamain(raw: PrismaFarmer): Farmer {
    return Farmer.create(
      {
        name: raw.name,
        document: raw.document,
        documentType: raw.documentType,
        farmName: raw.farmName,
        state: raw.state,
        city: raw.city,
        totalArea: raw.totalArea,
        arableArea: raw.arableArea,
        vegetationArea: raw.vegetationArea,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(farmer: Farmer): Prisma.FarmerUncheckedCreateInput {
    return {
      id: farmer.id.toString(),
      name: farmer.name,
      document: farmer.document,
      documentType: farmer.documentType,
      farmName: farmer.farmName,
      state: farmer.state,
      city: farmer.city,
      totalArea: farmer.totalArea,
      arableArea: farmer.arableArea,
      vegetationArea: farmer.vegetationArea,
      createdAt: farmer.createdAt,
      updatedAt: farmer.updatedAt,
    };
  }
}
