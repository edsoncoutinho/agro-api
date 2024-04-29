import { Either, left, right } from "@/core/either";
import { FarmersRepository } from "../repositories/farmers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { FarmerDetails } from "../entities/value-objects/farmer-details";

interface GetFarmerUseCaseRequest {
  farmerId: string;
}

type GetFarmerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    farmer: FarmerDetails;
  }
>;

export class GetFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    farmerId,
  }: GetFarmerUseCaseRequest): Promise<GetFarmerUseCaseResponse> {
    const farmer = await this.farmersRepository.findDetailsById(farmerId);

    if (!farmer) {
      return left(new ResourceNotFoundError());
    }

    return right({ farmer });
  }
}
