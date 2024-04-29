import { Plantation } from "@/domain/entities/plantation";
import { PlantationsRepository } from "@/domain/repositories/plantations-repository";

export class InMemoryPlantationsRepository implements PlantationsRepository {
  public items: Plantation[] = [];

  async create(plantation: Plantation) {
    this.items.push(plantation);
  }

  async findByTitle(title: string) {
    return this.items.find((plantation) => plantation.title === title) || null;
  }
}
