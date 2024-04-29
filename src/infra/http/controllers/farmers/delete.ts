import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DeleteFarmerUseCase } from "@/domain/use-cases/delete-farmer";
import { PrismaFarmersRepository } from "@/infra/database/prisma/repositories/prisma-farmers-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

export async function deleteFarmer(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    farmerId: z.string(),
  });

  const { farmerId } = registerBodySchema.parse(request.params);

  const farmersRepository = new PrismaFarmersRepository();
  const deleteFarmerUseCase = new DeleteFarmerUseCase(farmersRepository);

  const result = await deleteFarmerUseCase.execute({
    farmerId,
  });

  if (result.isLeft()) {
    const error = result.value;
    if (error instanceof ResourceNotFoundError) {
      return await reply.status(404).send({ message: error.message });
    }
    return await reply.status(500).send({ message: "Internal Server Error" });
  }

  return await reply.status(200).send();
}
