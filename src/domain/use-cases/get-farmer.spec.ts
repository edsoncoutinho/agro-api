import { InMemoryFarmersRepository } from "test/repositories/in-memory-farmers-repository";
import { makeFarmer } from "test/factories/make-farmer";
import { GetFarmerUseCase } from "./get-farmer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryFarmersRepository: InMemoryFarmersRepository;
let sut: GetFarmerUseCase;

describe("Get Farmer", () => {
  beforeEach(() => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    sut = new GetFarmerUseCase(inMemoryFarmersRepository);
  });

  it.only("should be able to get a farmer", async () => {
    const newFarmer = makeFarmer(
      {
        name: "John Doe",
      },
      new UniqueEntityID("farmer-1"),
    );

    inMemoryFarmersRepository.items.push(newFarmer);

    const result = await sut.execute({
      farmerId: newFarmer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryFarmersRepository.items[0]).toMatchObject({
      name: "John Doe",
    });
  });
});
