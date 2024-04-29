import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repositories/users-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { compare } from "bcryptjs";
import { User } from "../entities/user";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  { user: User }
>;

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    return right({ user });
  }
}
