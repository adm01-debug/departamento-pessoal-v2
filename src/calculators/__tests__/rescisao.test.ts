// V18-T005: Testes Calculadora Rescisão
import { describe, it, expect } from "vitest";
import { calcularRescisao, calcularSaldoSalario, calcularAvisoIndenizado } from "../rescisao";

describe("Calculadora Rescisão", () => {
  describe("calcularRescisao", () => {
    it("deve calcular rescisão sem justa causa completa", () => {
      const resultado = calcularRescisao({
        salario: 3000, dataAdmissao: "2020-01-01", dataDemissao: "2026-01-12",
        tipoRescisao: "sem_justa_causa", diasTrabalhados: 12
      });
      expect(resultado.saldoSalario).toBeGreaterThan(0);
      expect(resultado.avisoIndenizado).toBeGreaterThan(0);
      expect(resultado.multaFGTS).toBeGreaterThan(0);
    });

    it("deve calcular rescisão por justa causa", () => {
      const resultado = calcularRescisao({
        salario: 3000, dataAdmissao: "2020-01-01", dataDemissao: "2026-01-12",
        tipoRescisao: "justa_causa", diasTrabalhados: 12
      });
      expect(resultado.avisoIndenizado).toBe(0);
      expect(resultado.multaFGTS).toBe(0);
    });

    it("deve calcular rescisão por acordo", () => {
      const resultado = calcularRescisao({
        salario: 3000, dataAdmissao: "2020-01-01", dataDemissao: "2026-01-12",
        tipoRescisao: "acordo", diasTrabalhados: 12
      });
      expect(resultado.multaFGTS).toBeGreaterThan(0);
    });
  });

  describe("calcularSaldoSalario", () => {
    it("deve calcular proporcional aos dias trabalhados", () => {
      expect(calcularSaldoSalario(3000, 15)).toBe(1500);
      expect(calcularSaldoSalario(3000, 30)).toBe(3000);
    });
  });

  describe("calcularAvisoIndenizado", () => {
    it("deve calcular 30 dias + 3 dias por ano", () => {
      const resultado = calcularAvisoIndenizado(3000, 5);
      expect(resultado.dias).toBe(45);
    });

    it("deve limitar a 90 dias", () => {
      const resultado = calcularAvisoIndenizado(3000, 25);
      expect(resultado.dias).toBe(90);
    });
  });
});
