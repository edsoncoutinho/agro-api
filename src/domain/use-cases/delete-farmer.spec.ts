import { InMemoryFarmersRepository } from "test/repositories/in-memory-farmers-repository";
import { makeFarmer } from "test/factories/make-farmer";
import { DeleteFarmerUseCase } from "./delete-farmer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryFarmersRepository: InMemoryFarmersRepository;
let sut: DeleteFarmerUseCase;

describe("Delete Farmer", () => {
  beforeEach(() => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    sut = new DeleteFarmerUseCase(inMemoryFarmersRepository);
  });

  it("should be able to delete a farmer", async () => {
    const newFarmer = makeFarmer({}, new UniqueEntityID("farmer-1"));

    await inMemoryFarmersRepository.create(newFarmer);

    const result = await sut.execute({
      farmerId: "farmer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryFarmersRepository.items).toHaveLength(0);
  });
});
