import { InMemoryFarmersRepository } from "test/repositories/in-memory-farmers-repository";
import { makeFarmer } from "test/factories/make-farmer";
import { EditFarmerUseCase } from "./edit-farmer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryFarmersRepository: InMemoryFarmersRepository;
let sut: EditFarmerUseCase;

describe("Edit Farmer", () => {
  beforeEach(() => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    sut = new EditFarmerUseCase(inMemoryFarmersRepository);
  });

  it.only("should be able to edit a farmer", async () => {
    const newFarmer = makeFarmer(
      {
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 50,
      },
      new UniqueEntityID("farmer-1"),
    );

    inMemoryFarmersRepository.items.push(newFarmer);

    const result = await sut.execute({
      farmerId: newFarmer.id.toString(),
      name: "John Doe",
      document: "83136312791",
      documentType: "CPF",
      farmName: "Doe Farm",
      state: "MG",
      city: "Belo Horizonte",
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      plantations: [
        { id: "1", title: "Soja" },
        { id: "2", title: "Milho" },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryFarmersRepository.items[0]).toMatchObject({
      name: "John Doe",
    });
    expect(inMemoryFarmersRepository.items[0].plantations).toHaveLength(2);
    expect(inMemoryFarmersRepository.items[0].plantations).toEqual([
      expect.objectContaining({ title: "Soja" }),
      expect.objectContaining({ title: "Milho" }),
    ]);
  });
});
