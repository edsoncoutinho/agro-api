import { Either, right } from "@/core/either";
import { Dashboard } from "../entities/value-objects/dashboard";
import { FarmersRepository } from "../repositories/farmers-repository";

type GetDashboardUseCaseResponse = Either<
  null,
  {
    dashboard: Dashboard;
  }
>;

export class GetDashboardUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute(): Promise<GetDashboardUseCaseResponse> {
    const dashboard = await this.farmersRepository.getDashboardData();

    return right({ dashboard });
  }
}
