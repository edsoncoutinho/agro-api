import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../entities/user";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    const newUser = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 8),
    });

    await usersRepository.create(newUser);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
  });

  it("should not be able to authenticate with wrong email", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const newUser = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: await hash("123456", 8),
    });

    await usersRepository.create(newUser);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123123",
    });

    await expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
