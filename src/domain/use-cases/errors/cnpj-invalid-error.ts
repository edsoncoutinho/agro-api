import { UseCaseError } from "@/core/errors/use-case-error";

export class CnpjInvalidError extends Error implements UseCaseError {
  constructor() {
    super("CNPJ is invalid.");
  }
}
