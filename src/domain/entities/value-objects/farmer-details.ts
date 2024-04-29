import { ValueObject } from "@/core/entities/value-object";
import { Plantation } from "../plantation";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface FarmerDetailsProps {
  id: UniqueEntityID;
  name: string;
  document: string;
  documentType: string;
  farmName: string;
  state: string;
  city: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  plantations: Plantation[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class FarmerDetails extends ValueObject<FarmerDetailsProps> {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get document() {
    return this.props.document;
  }

  get documentType() {
    return this.props.documentType;
  }

  get farmName() {
    return this.props.farmName;
  }

  get state() {
    return this.props.state;
  }

  get city() {
    return this.props.city;
  }

  get totalArea() {
    return this.props.totalArea;
  }

  get arableArea() {
    return this.props.arableArea;
  }

  get vegetationArea() {
    return this.props.vegetationArea;
  }

  get plantations() {
    return this.props.plantations;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: FarmerDetailsProps) {
    return new FarmerDetails(props);
  }
}
