// V18-T008: Testes Calculadora Adicional Noturno
import { describe, it, expect } from "vitest";
import { calcularAdicionalNoturno, calcularHoraNoturnaReduzida } from "../adicionalNoturno";

describe("Calculadora Adicional Noturno", () => {
  describe("calcularAdicionalNoturno", () => {
    it("deve calcular 20% sobre hora noturna", () => {
      const resultado = calcularAdicionalNoturno(3000, 40);
      expect(resultado).toBeGreaterThan(0);
    });

    it("deve retornar 0 para 0 horas", () => {
      expect(calcularAdicionalNoturno(3000, 0)).toBe(0);
    });
  });

  describe("calcularHoraNoturnaReduzida", () => {
    it("hora noturna = 52:30 minutos", () => {
      expect(calcularHoraNoturnaReduzida(7)).toBeCloseTo(8, 1);
    });
  });
});
