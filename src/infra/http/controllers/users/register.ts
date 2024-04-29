import { UserAlreadyExistsError } from "@/domain/use-cases/errors/user-already-exists-error";
import { RegisterUserUseCase } from "@/domain/use-cases/register-user";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const userRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUserUseCase(userRepository);

  const result = await registerUseCase.execute({ name, email, password });

  if (result.isLeft()) {
    const error = result.value;
    if (error instanceof UserAlreadyExistsError) {
      return await reply.status(409).send({ message: error.message });
    }
    return await reply.status(500).send({ message: "Internal Server Error" });
  }

  return await reply.status(201).send();
}
