import { GetFarmerUseCase } from "@/domain/use-cases/get-farmer";
import { PrismaFarmersRepository } from "@/infra/database/prisma/repositories/prisma-farmers-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";
import { FarmerPresenter } from "../../presenters/farmer-presenter";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

export async function get(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerParamsSchema = z.object({
    farmerId: z.string(),
  });

  const { farmerId } = registerParamsSchema.parse(request.params);

  const farmersRepository = new PrismaFarmersRepository();
  const getFarmerUseCase = new GetFarmerUseCase(farmersRepository);

  const result = await getFarmerUseCase.execute({
    farmerId,
  });

  if (result.isLeft()) {
    if (result.value instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: result.value.message });
    }
    return await reply.status(500).send({ message: "Internal Server Error" });
  }

  const farmer = result.value.farmer;

  return await reply
    .status(200)
    .send({ farmer: FarmerPresenter.toHTTP(farmer) });
}
