import { Either, left, right } from "@/core/either";
import { FarmersRepository } from "../repositories/farmers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface DeleteFarmerUseCaseRequest {
  farmerId: string;
}

type DeleteFarmerUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    farmerId,
  }: DeleteFarmerUseCaseRequest): Promise<DeleteFarmerUseCaseResponse> {
    const farmer = await this.farmersRepository.findById(farmerId);

    if (!farmer) {
      return left(new ResourceNotFoundError());
    }

    await this.farmersRepository.delete(farmer);

    return right(null);
  }
}
