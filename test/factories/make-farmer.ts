import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Farmer, FarmerProps } from "@/domain/entities/farmer";
import { PrismaFarmerMapper } from "@/infra/database/prisma/mappers/prisma-farmer-mapper";
import { makePlantation } from "./make-plantations";
import { prisma } from "@/lib/prisma";

export function makeFarmer(
  override: Partial<FarmerProps> = {},
  id?: UniqueEntityID,
) {
  return Farmer.create(
    {
      name: faker.person.fullName(),
      document: faker.number
        .int({ min: 10000000000, max: 99999999999 })
        .toString(),
      documentType: "CPF",
      farmName: faker.company.name(),
      state: faker.location.state(),
      city: faker.location.city(),
      totalArea: faker.number.float(),
      arableArea: faker.number.float(),
      vegetationArea: faker.number.float(),
      plantations: [makePlantation()],
      ...override,
    },
    id,
  );
}

export class FarmerFactory {
  async makePrismaFarmer(data: Partial<FarmerProps> = {}): Promise<Farmer> {
    const farmer = makeFarmer(data);
    const farmerData = PrismaFarmerMapper.toPrisma(farmer);

    await prisma.farmer.create({
      data: {
        ...farmerData,
        plantations: {
          create: farmer.plantations.map((plantation) => ({
            id: plantation.id.toString(),
            title: plantation.title,
          })),
        },
      },
    });

    return farmer;
  }
}
