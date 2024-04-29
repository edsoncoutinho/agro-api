import { Plantation } from "../entities/plantation";

export interface PlantationsRepository {
  create(plantation: Plantation): Promise<void>;
  findByTitle(title: string): Promise<Plantation | null>;
}
