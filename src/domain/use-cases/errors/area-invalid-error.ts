import { UseCaseError } from "@/core/errors/use-case-error";

export class AreaInvalidError extends Error implements UseCaseError {
  constructor() {
    super(
      `The sum of the arable and vegetation areas must be less than or equal to total area.`,
    );
  }
}
