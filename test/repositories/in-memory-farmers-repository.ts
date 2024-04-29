import { Farmer } from "@/domain/entities/farmer";
import { Dashboard } from "@/domain/entities/value-objects/dashboard";
import { FarmerDetails } from "@/domain/entities/value-objects/farmer-details";
import { FarmersRepository } from "@/domain/repositories/farmers-repository";

export class InMemoryFarmersRepository implements FarmersRepository {
  public items: Farmer[] = [];

  async create(farmer: Farmer) {
    this.items.push(farmer);

    return farmer;
  }

  async save(farmer: Farmer) {
    const itemIndex = this.items.findIndex((item) => item.id === farmer.id);
    this.items[itemIndex] = farmer;

    return farmer;
  }

  async delete(farmer: Farmer) {
    const itemIndex = this.items.findIndex((item) => item.id === farmer.id);

    this.items.splice(itemIndex, 1);
  }

  async findById(farmerId: string) {
    return (
      this.items.find((farmer) => farmer.id.toString() === farmerId) || null
    );
  }

  async findDetailsById(farmerId: string) {
    const farmer = this.items.find(
      (farmer) => farmer.id.toString() === farmerId,
    );

    if (!farmer) {
      return null;
    }

    return FarmerDetails.create({
      id: farmer.id,
      name: farmer.name,
      document: farmer.document,
      documentType: farmer.documentType,
      farmName: farmer.farmName,
      state: farmer.state,
      city: farmer.city,
      totalArea: farmer.totalArea,
      arableArea: farmer.arableArea,
      vegetationArea: farmer.vegetationArea,
      plantations: farmer.plantations,
      createdAt: farmer.createdAt,
      updatedAt: farmer.updatedAt || null,
    });
  }

  async getDashboardData() {
    const farmersCount = this.items.length;

    let totalArea = 0;
    let arableArea = 0;
    let vegetationArea = 0;
    this.items.map((farmer) => {
      totalArea += farmer.totalArea;
      arableArea += farmer.arableArea;
      vegetationArea += farmer.vegetationArea;
    });

    const farmersGroupedByState = this.items.reduce((acc, curr) => {
      const { state } = curr;

      if (!acc[state]) {
        acc[state] = 0;
      }

      acc[state]++;

      return acc;
    }, []);
    const farmersByState = Object.entries(farmersGroupedByState).map(
      ([state, farmers]) => ({ state, farmers }),
    );

    const farmersGroupedByPlantation = this.items.reduce((acc, curr) => {
      const { plantations } = curr;

      plantations.map((plantation) => {
        if (!acc[plantation.title]) {
          acc[plantation.title] = 0;
        }

        acc[plantation.title]++;
      });

      return acc;
    }, []);

    const farmersByPlantation = Object.entries(farmersGroupedByPlantation).map(
      ([plantation, farmers]) => ({ plantation, farmers }),
    );

    return Dashboard.create({
      farmers: farmersCount,
      totalArea,
      farmersByState,
      farmersByPlantation,
      farmersByArableAndVegetationArea: {
        arableArea,
        vegetationArea,
      },
    });
  }
}
