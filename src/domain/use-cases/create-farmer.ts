import { FarmersRepository } from "../repositories/farmers-repository";
import { Farmer } from "../entities/farmer";
import { Either, left, right } from "@/core/either";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { CpfInvalidError } from "./errors/cpf-invalid-error";
import { CnpjInvalidError } from "./errors/cnpj-invalid-error";
import { AreaInvalidError } from "./errors/area-invalid-error";
import { Plantation } from "../entities/plantation";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateFarmerUseCaseRequest {
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

type CreateFarmerUseCaseResponse = Either<
  CpfInvalidError | CnpjInvalidError | AreaInvalidError,
  { farmer: Farmer }
>;

export class CreateFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
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
  }: CreateFarmerUseCaseRequest): Promise<CreateFarmerUseCaseResponse> {
    if (documentType === "CPF" && cpf.isValid(document) === false) {
      return left(new CpfInvalidError());
    }

    if (documentType === "CNPJ" && cnpj.isValid(document) === false) {
      return left(new CnpjInvalidError());
    }

    if (totalArea < arableArea + vegetationArea) {
      return left(new AreaInvalidError());
    }

    const farmer = Farmer.create({
      name,
      document,
      documentType,
      farmName,
      state,
      city,
      totalArea,
      arableArea,
      vegetationArea,
    });

    const plantationsEntities = plantations.map((plantation) =>
      Plantation.create(
        {
          title: plantation.title,
        },
        new UniqueEntityID(plantation.id),
      ),
    );

    farmer.plantations = plantationsEntities;

    await this.farmersRepository.create(farmer);

    return right({ farmer });
  }
}
