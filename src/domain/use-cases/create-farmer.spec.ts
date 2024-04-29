import { InMemoryFarmersRepository } from "test/repositories/in-memory-farmers-repository";
import { CreateFarmerUseCase } from "./create-farmer";
import { CpfInvalidError } from "./errors/cpf-invalid-error";
import { CnpjInvalidError } from "./errors/cnpj-invalid-error";
import { AreaInvalidError } from "./errors/area-invalid-error";

let inMemoryFarmersRepository: InMemoryFarmersRepository;
let sut: CreateFarmerUseCase;

describe("Create Farmer", () => {
  beforeEach(() => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    sut = new CreateFarmerUseCase(inMemoryFarmersRepository);
  });

  it("should be able to create a farmer", async () => {
    const result = await sut.execute({
      name: "John Doe",
      document: "71856603270",
      documentType: "CPF",
      farmName: "Doe Farm",
      state: "MG",
      city: "Belo Horizonte",
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      plantations: [
        {
          id: "1",
          title: "Soja",
        },
        {
          id: "2",
          title: "Milho",
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      farmer: inMemoryFarmersRepository.items[0],
    });
  });

  it("should not be able to create a farmer with invalid CPF", async () => {
    const result = await sut.execute({
      name: "John Doe",
      document: "123",
      documentType: "CPF",
      farmName: "Doe Farm",
      state: "MG",
      city: "Belo Horizonte",
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      plantations: [
        {
          id: "1",
          title: "Soja",
        },
        {
          id: "2",
          title: "Milho",
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CpfInvalidError);
  });

  it("should not be able to create a farmer with invalid CNPJ", async () => {
    const result = await sut.execute({
      name: "John Doe",
      document: "123",
      documentType: "CNPJ",
      farmName: "Doe Farm",
      state: "MG",
      city: "Belo Horizonte",
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      plantations: [
        {
          id: "1",
          title: "Soja",
        },
        {
          id: "2",
          title: "Milho",
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CnpjInvalidError);
  });

  it("should not be able to create a farmer with invalid area", async () => {
    const result = await sut.execute({
      name: "John Doe",
      document: "71856603270",
      documentType: "CPF",
      farmName: "Doe Farm",
      state: "MG",
      city: "Belo Horizonte",
      totalArea: 100,
      arableArea: 100,
      vegetationArea: 50,
      plantations: [
        {
          id: "1",
          title: "Soja",
        },
        {
          id: "2",
          title: "Milho",
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AreaInvalidError);
  });
});
