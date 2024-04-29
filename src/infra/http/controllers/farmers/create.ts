import { CreateFarmerUseCase } from "@/domain/use-cases/create-farmer";
import { AreaInvalidError } from "@/domain/use-cases/errors/area-invalid-error";
import { CnpjInvalidError } from "@/domain/use-cases/errors/cnpj-invalid-error";
import { CpfInvalidError } from "@/domain/use-cases/errors/cpf-invalid-error";
import { PrismaFarmersRepository } from "@/infra/database/prisma/repositories/prisma-farmers-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

export async function create(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string().min(3),
    document: z.string().min(11).max(14),
    documentType: z.enum(["CPF", "CNPJ"]),
    farmName: z.string().min(3),
    state: z.string().min(2),
    city: z.string().min(2),
    totalArea: z.number().min(0),
    arableArea: z.number().min(0),
    vegetationArea: z.number().min(0),
    plantations: z.array(z.object({ id: z.string(), title: z.string() })),
  });

  const {
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
  } = registerBodySchema.parse(request.body);

  const farmersRepository = new PrismaFarmersRepository();
  const createFarmerUseCase = new CreateFarmerUseCase(farmersRepository);

  const result = await createFarmerUseCase.execute({
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
  });

  if (result.isLeft()) {
    const error = result.value;
    if (error instanceof CpfInvalidError) {
      return await reply.status(409).send({ message: error.message });
    }
    if (error instanceof CnpjInvalidError) {
      return await reply.status(409).send({ message: error.message });
    }
    if (error instanceof AreaInvalidError) {
      return await reply.status(409).send({ message: error.message });
    }
    return await reply.status(500).send({ message: "Internal Server Error" });
  }

  return await reply.status(201).send();
}
