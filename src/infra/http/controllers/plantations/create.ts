import { CreatePlantationUseCase } from "@/domain/use-cases/create-plantation";
import { AreaInvalidError } from "@/domain/use-cases/errors/area-invalid-error";
import { CnpjInvalidError } from "@/domain/use-cases/errors/cnpj-invalid-error";
import { CpfInvalidError } from "@/domain/use-cases/errors/cpf-invalid-error";
import { PrismaPlantationsRepository } from "@/infra/database/prisma/repositories/prisma-plantations-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

export async function create(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    title: z.string().min(3),
  });

  const { title } = registerBodySchema.parse(request.body);

  const plantationsRepository = new PrismaPlantationsRepository();
  const createPlantationUseCase = new CreatePlantationUseCase(
    plantationsRepository,
  );

  const result = await createPlantationUseCase.execute({ title });

  if (result.isLeft()) {
    const error = result.value;
    if (error instanceof AreaInvalidError) {
      return await reply.status(400).send({ message: error.message });
    }
    if (error instanceof CnpjInvalidError) {
      return await reply.status(400).send({ message: error.message });
    }
    if (error instanceof CpfInvalidError) {
      return await reply.status(400).send({ message: error.message });
    }
    return await reply.status(500).send({ message: "Internal Server Error" });
  }

  return await reply.status(201).send();
}
