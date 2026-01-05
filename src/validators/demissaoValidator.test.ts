import { describe, it, expect } from "vitest";
import { demissaoValidator } from "./demissaoValidator";
describe("demissaoValidator", () => {
  it("valida demissão sem justa causa", () => {
    const result = demissaoValidator.validate({ colaboradorId: "123", data: new Date(), tipo: "SEM_JUSTA_CAUSA" });
    expect(result.success).toBe(true);
  });
  it("calcula prazos de aviso prévio", () => {
    const prazos = demissaoValidator.validarPrazos(new Date("2025-01-05"));
    expect(prazos.avisoPrevio).toBeInstanceOf(Date);
    expect(prazos.homologacao).toBeInstanceOf(Date);
  });
});
