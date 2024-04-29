import { AreaInvalidError } from "@/domain/use-cases/errors/area-invalid-error";
import { CnpjInvalidError } from "@/domain/use-cases/errors/cnpj-invalid-error";
import { CpfInvalidError } from "@/domain/use-cases/errors/cpf-invalid-error";
import { PrismaFarmersRepository } from "@/infra/database/prisma/repositories/prisma-farmers-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { GetDashboardUseCase } from "@/domain/use-cases/dashboard";
import { DashboardPresenter } from "../../presenters/dashboard-presenter";

export async function dashboard(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const farmersRepository = new PrismaFarmersRepository();

    const dashboardUseCase = new GetDashboardUseCase(farmersRepository);

    const result = await dashboardUseCase.execute();

    if (result.isLeft()) {
      return await reply.status(404).send({ message: "Farmer not found" });
    }

    return await reply
      .status(200)
      .send({ dashboard: DashboardPresenter.toHTTP(result.value.dashboard) });
  } catch (err) {
    if (err instanceof CpfInvalidError) {
      return await reply.status(400).send({ message: err.message });
    }

    if (err instanceof CnpjInvalidError) {
      return await reply.status(400).send({ message: err.message });
    }

    if (err instanceof AreaInvalidError) {
      return await reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
