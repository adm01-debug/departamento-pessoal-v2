import { describe, it, expect } from "vitest";
import { pensaoValidator } from "./pensaoValidator";
describe("pensaoValidator", () => {
  it("calcula valor percentual", () => {
    const valor = pensaoValidator.calcularValor(5000, "PERCENTUAL", 30, undefined);
    expect(valor).toBe(1500);
  });
  it("calcula valor fixo", () => {
    const valor = pensaoValidator.calcularValor(5000, "VALOR_FIXO", undefined, 800);
    expect(valor).toBe(800);
  });
  it("valida pensão ativa", () => {
    const result = pensaoValidator.validate({ colaboradorId: "123", beneficiario: "Maria", tipoCalculo: "PERCENTUAL", percentual: 30, baseCalculo: "LIQUIDO", dataInicio: new Date(), ativo: true });
    expect(result.success).toBe(true);
  });
});
