import {
  Farmer as PrismaFarmer,
  Plantation as PrismaPlantation,
} from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FarmerDetails } from "@/domain/entities/value-objects/farmer-details";
import { PrismaPlantationMapper } from "./prisma-plantation-mapper";

type PrismaFarmerDetails = PrismaFarmer & {
  plantations: PrismaPlantation[];
};

export class PrismaFarmerDetailsMapper {
  static toDomain(raw: PrismaFarmerDetails): FarmerDetails {
    return FarmerDetails.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      document: raw.document,
      documentType: raw.documentType,
      farmName: raw.farmName,
      state: raw.state,
      city: raw.city,
      totalArea: raw.totalArea,
      arableArea: raw.arableArea,
      vegetationArea: raw.vegetationArea,
      plantations: raw.plantations.map(PrismaPlantationMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
