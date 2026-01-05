import { describe, it, expect } from "vitest";
import { calculoProporcional } from "./calculoProporcional";
describe("calculoProporcional", () => {
  it("calcula proporcional de dias corretamente", () => {
    const result = calculoProporcional({ valorIntegral: 3000, diasTrabalhados: 15, diasMes: 30 });
    expect(result.fator).toBe(0.5);
    expect(result.valorProporcional).toBe(1500);
  });
  it("retorna valor integral para mês completo", () => {
    const result = calculoProporcional({ valorIntegral: 3000, diasTrabalhados: 30, diasMes: 30 });
    expect(result.fator).toBe(1);
    expect(result.valorProporcional).toBe(3000);
  });
});
