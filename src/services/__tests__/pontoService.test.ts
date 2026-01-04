import { describe, it, expect, vi, beforeEach } from "vitest";
import pontoService from "../pontoService";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), delete: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) })) }
}));

describe("pontoService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("registrarPonto", () => {
    it("deve registrar entrada com sucesso", async () => {
      const registro = { colaboradorId: "123", tipo: "entrada" as const, dataHora: new Date() };
      const result = await pontoService.registrarPonto(registro);
      expect(result).toBeDefined();
    });

    it("deve registrar saída com sucesso", async () => {
      const registro = { colaboradorId: "123", tipo: "saida" as const, dataHora: new Date() };
      const result = await pontoService.registrarPonto(registro);
      expect(result).toBeDefined();
    });

    it("deve validar colaborador antes de registrar", async () => {
      const registro = { colaboradorId: "", tipo: "entrada" as const, dataHora: new Date() };
      await expect(pontoService.registrarPonto(registro)).rejects.toThrow();
    });
  });

  describe("getEspelhoPonto", () => {
    it("deve retornar espelho do mês", async () => {
      const result = await pontoService.getEspelhoPonto("123", 2024, 1);
      expect(result).toBeDefined();
    });

    it("deve calcular horas trabalhadas", async () => {
      const result = await pontoService.getEspelhoPonto("123", 2024, 1);
      expect(result?.horasTrabalhadas).toBeDefined();
    });
  });

  describe("getBancoHoras", () => {
    it("deve retornar saldo do banco de horas", async () => {
      const result = await pontoService.getBancoHoras("123");
      expect(result).toBeDefined();
    });
  });

  describe("calcularHorasExtras", () => {
    it("deve calcular horas extras corretamente", () => {
      const horasTrabalhadas = 10;
      const jornadaDiaria = 8;
      const extras = pontoService.calcularHorasExtras(horasTrabalhadas, jornadaDiaria);
      expect(extras).toBe(2);
    });

    it("deve retornar zero se não houver extras", () => {
      const extras = pontoService.calcularHorasExtras(6, 8);
      expect(extras).toBe(0);
    });
  });

  describe("validarJornada", () => {
    it("deve validar jornada dentro do limite", () => {
      const valid = pontoService.validarJornada(8, 10);
      expect(valid).toBe(true);
    });

    it("deve rejeitar jornada acima do limite", () => {
      const valid = pontoService.validarJornada(12, 10);
      expect(valid).toBe(false);
    });
  });
});
