import { Farmer } from "../entities/farmer";
import { Dashboard } from "../entities/value-objects/dashboard";
import { FarmerDetails } from "../entities/value-objects/farmer-details";

export interface FarmersRepository {
  create: (farmer: Farmer) => Promise<Farmer>;
  save: (farmer: Farmer) => Promise<Farmer>;
  delete: (farmer: Farmer) => Promise<void>;
  findById: (farmerId: string) => Promise<Farmer | null>;
  findDetailsById: (farmerId: string) => Promise<FarmerDetails | null>;
  getDashboardData: () => Promise<Dashboard>;
}
