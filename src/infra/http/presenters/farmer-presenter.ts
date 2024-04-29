import { FarmerDetails } from "@/domain/entities/value-objects/farmer-details";
import { PlantationPresenter } from "./plantations-presenter";

export class FarmerPresenter {
  static toHTTP(farmer: FarmerDetails) {
    return {
      id: farmer.id.toString(),
      name: farmer.name,
      document: farmer.document,
      documentType: farmer.documentType,
      farmName: farmer.farmName,
      state: farmer.state,
      city: farmer.city,
      totalArea: farmer.totalArea,
      arableArea: farmer.arableArea,
      vegetationArea: farmer.vegetationArea,
      plantations: farmer.plantations.map(PlantationPresenter.toHTTP),
    };
  }
}
