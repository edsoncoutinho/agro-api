import { UseCaseError } from "@/core/errors/use-case-error";

export class ContentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Content "${identifier}" exists.`);
  }
}
