// V18-T014: Testes Médias
import { describe, it, expect } from "vitest";
import { calcularMediaVariaveis, calcularMedia12Meses } from "../medias";
describe("Calculadora Médias", () => {
  it("deve calcular média simples", () => {
    expect(calcularMediaVariaveis([100,200,300])).toBe(200);
  });
  it("deve ignorar meses zerados", () => {
    expect(calcularMediaVariaveis([100,0,200],true)).toBe(150);
  });
});
