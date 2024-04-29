import { CreatePlantationUseCase } from "./create-plantation";
import { InMemoryPlantationsRepository } from "test/repositories/in-memory-plantations-repository";
import { ContentAlreadyExistsError } from "./errors/content-already-exists-error";
import { makePlantation } from "test/factories/make-plantations";

let inMemoryPlantationsRepository: InMemoryPlantationsRepository;
let sut: CreatePlantationUseCase;

describe("Create Plantation", () => {
  beforeEach(() => {
    inMemoryPlantationsRepository = new InMemoryPlantationsRepository();
    sut = new CreatePlantationUseCase(inMemoryPlantationsRepository);
  });

  it("should be able to create a plantation", async () => {
    const result = await sut.execute({
      title: "Milho",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      plantation: inMemoryPlantationsRepository.items[0],
    });
  });

  it("should not be able to create a plantation with same title", async () => {
    const newPlantation = makePlantation({ title: "Milho" });

    await inMemoryPlantationsRepository.create(newPlantation);

    const result = await sut.execute({
      title: "Milho",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ContentAlreadyExistsError);
  });
});
