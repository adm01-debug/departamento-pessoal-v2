// V18-T006: Testes Calculadora Horas Extras
import { describe, it, expect } from "vitest";
import { calcularHoraExtra, calcularHoraExtraDSR, calcularValorHora } from "../horasExtras";

describe("Calculadora Horas Extras", () => {
  describe("calcularHoraExtra", () => {
    it("deve calcular HE 50%", () => {
      const resultado = calcularHoraExtra(3000, 10, 50);
      expect(resultado).toBeCloseTo(204.55, 2);
    });

    it("deve calcular HE 100%", () => {
      const resultado = calcularHoraExtra(3000, 10, 100);
      expect(resultado).toBeCloseTo(272.73, 2);
    });
  });

  describe("calcularValorHora", () => {
    it("deve calcular valor hora base (220h/mês)", () => {
      expect(calcularValorHora(2200)).toBeCloseTo(10, 2);
      expect(calcularValorHora(3300)).toBeCloseTo(15, 2);
    });
  });
});
