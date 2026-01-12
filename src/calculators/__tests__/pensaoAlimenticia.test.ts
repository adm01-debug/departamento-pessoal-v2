// V18-T011: Testes Pensão Alimentícia
import { describe, it, expect } from "vitest";
import { calcularPensaoAlimenticia } from "../pensaoAlimenticia";
describe("Calculadora Pensão Alimentícia", () => {
  it("deve calcular percentual do líquido", () => {
    expect(calcularPensaoAlimenticia(3000, 30, "percentual")).toBe(900);
  });
  it("deve usar valor fixo", () => {
    expect(calcularPensaoAlimenticia(3000, 500, "fixo")).toBe(500);
  });
});
