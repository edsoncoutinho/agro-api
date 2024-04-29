import { Plantation } from "@/domain/entities/plantation";

export class PlantationPresenter {
  static toHTTP(plantation: Plantation) {
    return {
      id: plantation.id.toString(),
      title: plantation.title,
    };
  }
}
