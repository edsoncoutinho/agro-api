import { ValueObject } from "@/core/entities/value-object";

export interface DashboardProps {
  farmers: number;
  totalArea: number;
  farmersByState: {
    state: string;
    farmers: number;
  }[];
  farmersByPlantation: {
    plantation: string;
    farmers: number;
  }[];
  farmersByArableAndVegetationArea: {
    arableArea: number;
    vegetationArea: number;
  };
}

export class Dashboard extends ValueObject<DashboardProps> {
  get farmers() {
    return this.props.farmers;
  }

  get totalArea() {
    return this.props.totalArea;
  }

  get farmersByState() {
    return this.props.farmersByState;
  }

  get farmersByPlantation() {
    return this.props.farmersByPlantation;
  }

  get farmersByArableAndVegetationArea() {
    return this.props.farmersByArableAndVegetationArea;
  }

  static create(props: DashboardProps) {
    return new Dashboard(props);
  }
}
