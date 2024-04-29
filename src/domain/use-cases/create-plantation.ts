import { Either, left, right } from "@/core/either";
import { PlantationsRepository } from "../repositories/plantations-repository";
import { Plantation } from "../entities/plantation";
import { ContentAlreadyExistsError } from "./errors/content-already-exists-error";

interface CreatePlantationUseCaseRequest {
  title: string;
}

type CreatePlantationUseCaseResponse = Either<
  ContentAlreadyExistsError,
  { plantation: Plantation }
>;

export class CreatePlantationUseCase {
  constructor(private plantationsRepository: PlantationsRepository) {}

  async execute({
    title,
  }: CreatePlantationUseCaseRequest): Promise<CreatePlantationUseCaseResponse> {
    const plantationAlreadyExists =
      await this.plantationsRepository.findByTitle(title);

    if (plantationAlreadyExists) {
      return left(new ContentAlreadyExistsError(title));
    }

    const plantation = Plantation.create({
      title,
    });

    await this.plantationsRepository.create(plantation);

    return right({ plantation });
  }
}
