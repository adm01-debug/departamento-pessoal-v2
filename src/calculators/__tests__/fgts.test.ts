// V18-T003: Testes Calculadora FGTS
import { describe, it, expect } from "vitest";
import { calcularFGTS, calcularFGTSMensal, calcularFGTSRescisao } from "../fgts";

describe("Calculadora FGTS", () => {
  describe("calcularFGTS", () => {
    it("deve calcular 8% do salário bruto", () => {
      expect(calcularFGTS(1000)).toBe(80);
      expect(calcularFGTS(5000)).toBe(400);
    });

    it("deve retornar 0 para salário zero ou negativo", () => {
      expect(calcularFGTS(0)).toBe(0);
      expect(calcularFGTS(-1000)).toBe(0);
    });

    it("deve arredondar corretamente", () => {
      const resultado = calcularFGTS(1234.56);
      expect(resultado).toBeCloseTo(98.76, 2);
    });
  });

  describe("calcularFGTSMensal", () => {
    it("deve calcular FGTS sobre todas verbas", () => {
      const verbas = { salario: 3000, horasExtras: 500, comissao: 200 };
      const resultado = calcularFGTSMensal(verbas);
      expect(resultado).toBeCloseTo(296, 2);
    });
  });

  describe("calcularFGTSRescisao", () => {
    it("deve calcular multa 40% para demissão sem justa causa", () => {
      const resultado = calcularFGTSRescisao(10000, "sem_justa_causa");
      expect(resultado.multa).toBe(4000);
    });

    it("deve calcular multa 20% para acordo", () => {
      const resultado = calcularFGTSRescisao(10000, "acordo");
      expect(resultado.multa).toBe(2000);
    });

    it("deve calcular multa 0% para justa causa", () => {
      const resultado = calcularFGTSRescisao(10000, "justa_causa");
      expect(resultado.multa).toBe(0);
    });
  });
});
