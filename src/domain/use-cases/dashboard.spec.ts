import { GetDashboardUseCase } from "./dashboard";
import { InMemoryFarmersRepository } from "test/repositories/in-memory-farmers-repository";
import { makeFarmer } from "test/factories/make-farmer";

let inMemoryFarmersRepository: InMemoryFarmersRepository;
let sut: GetDashboardUseCase;

describe("Get Dashboard", () => {
  beforeEach(() => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    sut = new GetDashboardUseCase(inMemoryFarmersRepository);
  });

  it("should be able to get a dashboard", async () => {
    const farmer1 = makeFarmer();
    const farmer2 = makeFarmer();

    inMemoryFarmersRepository.items.push(farmer1);
    inMemoryFarmersRepository.items.push(farmer2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value?.dashboard.farmers).toBe(2);
  });
});
