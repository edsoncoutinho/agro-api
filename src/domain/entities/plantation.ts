import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface PlantationProps {
  title: string;
}

export class Plantation extends Entity<PlantationProps> {
  get title() {
    return this.props.title;
  }

  static create(props: PlantationProps, id?: UniqueEntityID) {
    const plantation = new Plantation(props, id);

    return plantation;
  }
}
