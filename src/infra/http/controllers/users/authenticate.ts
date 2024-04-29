import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";
import { AuthenticateUserUseCase } from "@/domain/use-cases/authenticate-user";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  const userRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUserUseCase(userRepository);

  const result = await authenticateUseCase.execute({ email, password });

  if (result.isLeft()) {
    return await reply.status(400).send({ message: result.value.message });
  }

  const user = result.value.user;

  const token = await reply.jwtSign({
    sign: {
      sub: user.id,
    },
  });

  const refreshToken = await reply.jwtSign({
    sign: {
      sub: user.id,
      expiresIn: "7d",
    },
  });

  return await reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ access_token: token });
}
