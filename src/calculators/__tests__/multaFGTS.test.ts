// V18-T016: Testes Multa FGTS
import { describe, it, expect } from "vitest";
import { calcularMultaFGTS } from "../multaFGTS";
describe("Calculadora Multa FGTS", () => {
  it("deve calcular 40% para demissão sem justa causa", () => {
    expect(calcularMultaFGTS(10000, 40)).toBe(4000);
  });
  it("deve calcular 20% para acordo", () => {
    expect(calcularMultaFGTS(10000, 20)).toBe(2000);
  });
});
