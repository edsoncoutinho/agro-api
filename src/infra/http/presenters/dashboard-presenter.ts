import { Dashboard } from "@/domain/entities/value-objects/dashboard";

export class DashboardPresenter {
  static toHTTP(dashboard: Dashboard) {
    return {
      farmers: dashboard.farmers,
      totalArea: dashboard.totalArea,
      farmersByState: dashboard.farmersByState.map((state) => ({
        state: state.state,
        farmers: state.farmers,
      })),
      farmersByPlantation: dashboard.farmersByPlantation.map((plantation) => ({
        plantation: plantation.plantation,
        farmers: plantation.farmers,
      })),
      farmersByArableAndVegetationArea: {
        arableArea: dashboard.farmersByArableAndVegetationArea.arableArea,
        vegetationArea:
          dashboard.farmersByArableAndVegetationArea.vegetationArea,
      },
    };
  }
}
