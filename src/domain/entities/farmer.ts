import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Plantation } from "./plantation";

export interface FarmerProps {
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

export class Farmer extends Entity<FarmerProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get document() {
    return this.props.document;
  }

  set document(document: string) {
    this.props.document = document;
    this.touch();
  }

  get documentType() {
    return this.props.documentType;
  }

  set documentType(documentType: string) {
    this.props.documentType = documentType;
    this.touch();
  }

  get farmName() {
    return this.props.farmName;
  }

  set farmName(farmName: string) {
    this.props.farmName = farmName;
    this.touch();
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get totalArea() {
    return this.props.totalArea;
  }

  set totalArea(totalArea: number) {
    this.props.totalArea = totalArea;
    this.touch();
  }

  get arableArea() {
    return this.props.arableArea;
  }

  set arableArea(arableArea: number) {
    this.props.arableArea = arableArea;
    this.touch();
  }

  get vegetationArea() {
    return this.props.vegetationArea;
  }

  set vegetationArea(vegetationArea: number) {
    this.props.vegetationArea = vegetationArea;
    this.touch();
  }

  get plantations() {
    return this.props.plantations;
  }

  set plantations(plantations: Plantation[]) {
    this.props.plantations = plantations;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<FarmerProps, "createdAt" | "plantations">,
    id?: UniqueEntityID,
  ) {
    const farmer = new Farmer(
      {
        ...props,
        plantations: props.plantations ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return farmer;
  }
}
