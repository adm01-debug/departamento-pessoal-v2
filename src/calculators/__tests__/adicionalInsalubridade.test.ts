// V18-T010: Testes Calculadora Adicional Insalubridade
import { describe, it, expect } from "vitest";
import { calcularAdicionalInsalubridade } from "../adicionalInsalubridade";

describe("Calculadora Adicional Insalubridade", () => {
  const salarioMinimo = 1621;

  it("deve calcular grau mínimo (10%)", () => {
    expect(calcularAdicionalInsalubridade(salarioMinimo, "minimo")).toBeCloseTo(162.10, 2);
  });

  it("deve calcular grau médio (20%)", () => {
    expect(calcularAdicionalInsalubridade(salarioMinimo, "medio")).toBeCloseTo(324.20, 2);
  });

  it("deve calcular grau máximo (40%)", () => {
    expect(calcularAdicionalInsalubridade(salarioMinimo, "maximo")).toBeCloseTo(648.40, 2);
  });
});
