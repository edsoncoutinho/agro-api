import { RegisterUserUseCase } from "./register-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { compare } from "bcryptjs";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to register a new user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it("should hash user password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      inMemoryUsersRepository.items[0].password,
    );

    expect(result.isRight()).toBe(true);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
