import { Either, left, right } from "@/core/either";
import { Farmer } from "../entities/farmer";
import { FarmersRepository } from "../repositories/farmers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Plantation } from "../entities/plantation";

interface EditFarmerUseCaseRequest {
  farmerId: string;
  name: string;
  document: string;
  documentType: "CPF" | "CNPJ";
  farmName: string;
  state: string;
  city: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  plantations: { id: string; title: string }[];
}

type EditFarmerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    farmer: Farmer;
  }
>;

export class EditFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    farmerId,
    name,
    document,
    documentType,
    farmName,
    state,
    city,
    totalArea,
    arableArea,
    vegetationArea,
    plantations,
  }: EditFarmerUseCaseRequest): Promise<EditFarmerUseCaseResponse> {
    const farmer = await this.farmersRepository.findById(farmerId);

    if (!farmer) {
      return left(new ResourceNotFoundError());
    }

    if (documentType === "CPF" && document.length !== 11) {
      return left(new ResourceNotFoundError());
    }

    if (documentType === "CNPJ" && document.length !== 14) {
      return left(new ResourceNotFoundError());
    }

    if (totalArea < arableArea + vegetationArea) {
      return left(new ResourceNotFoundError());
    }

    farmer.name = name;
    farmer.document = document;
    farmer.documentType = documentType;
    farmer.farmName = farmName;
    farmer.state = state;
    farmer.city = city;
    farmer.totalArea = totalArea;
    farmer.arableArea = arableArea;
    farmer.vegetationArea = vegetationArea;

    farmer.plantations = plantations.map((plantation) =>
      Plantation.create(
        {
          title: plantation.title,
        },
        new UniqueEntityID(plantation.id),
      ),
    );

    await this.farmersRepository.save(farmer);

    return right({ farmer });
  }
}
