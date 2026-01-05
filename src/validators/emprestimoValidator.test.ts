import { describe, it, expect } from "vitest";
import { emprestimoValidator } from "./emprestimoValidator";
describe("emprestimoValidator", () => {
  it("valida empréstimo consignado", () => {
    const result = emprestimoValidator.validate({ colaboradorId: "123", tipo: "CONSIGNADO", valorTotal: 10000, quantidadeParcelas: 24, valorParcela: 500, situacao: "ATIVO" });
    expect(result.success).toBe(true);
  });
  it("calcula valor parcela", () => {
    const parcela = emprestimoValidator.calcularParcela(10000, 24, 1.5);
    expect(parcela).toBeGreaterThan(416.67);
  });
  it("valida margem consignável", () => {
    const valido = emprestimoValidator.validarMargem(3000, 500);
    expect(valido).toBe(true);
  });
  it("rejeita parcela acima da margem", () => {
    const valido = emprestimoValidator.validarMargem(3000, 1500);
    expect(valido).toBe(false);
  });
});
