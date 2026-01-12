// V18-T009: Testes Calculadora Adicional Periculosidade
import { describe, it, expect } from "vitest";
import { calcularAdicionalPericulosidade } from "../adicionalPericulosidade";

describe("Calculadora Adicional Periculosidade", () => {
  it("deve calcular 30% do salário base", () => {
    expect(calcularAdicionalPericulosidade(3000)).toBe(900);
    expect(calcularAdicionalPericulosidade(5000)).toBe(1500);
  });

  it("deve retornar 0 para salário zero", () => {
    expect(calcularAdicionalPericulosidade(0)).toBe(0);
  });
});
