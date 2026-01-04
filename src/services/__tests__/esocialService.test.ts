import { describe, it, expect, vi, beforeEach } from "vitest";
import esocialService from "../esocialService";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: null }) })) }
}));

describe("esocialService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("gerarEvento", () => {
    it("deve gerar evento S-1000 corretamente", async () => {
      const dados = { tpInsc: "1", nrInsc: "12345678000199" };
      const result = await esocialService.gerarEvento("S-1000", dados);
      expect(result).toBeDefined();
      expect(result?.tipo).toBe("S-1000");
    });

    it("deve gerar evento S-2200 corretamente", async () => {
      const dados = { cpf: "12345678901", nome: "Funcionário Teste" };
      const result = await esocialService.gerarEvento("S-2200", dados);
      expect(result).toBeDefined();
    });
  });

  describe("validarEvento", () => {
    it("deve validar evento com dados corretos", async () => {
      const evento = { tipo: "S-1000", dados: { tpInsc: "1", nrInsc: "12345678000199" } };
      const result = await esocialService.validarEvento(evento);
      expect(result.valido).toBe(true);
    });

    it("deve rejeitar evento com dados inválidos", async () => {
      const evento = { tipo: "S-1000", dados: {} };
      const result = await esocialService.validarEvento(evento);
      expect(result.valido).toBe(false);
    });
  });

  describe("enviarLote", () => {
    it("deve enviar lote de eventos", async () => {
      const eventos = [{ id: "1", tipo: "S-1000", dados: {} }];
      const result = await esocialService.enviarLote(eventos);
      expect(result).toBeDefined();
    });
  });

  describe("consultarRecibo", () => {
    it("deve consultar recibo de entrega", async () => {
      const result = await esocialService.consultarRecibo("123456");
      expect(result).toBeDefined();
    });
  });

  describe("gerarXML", () => {
    it("deve gerar XML do evento", () => {
      const evento = { tipo: "S-1000", dados: { tpInsc: "1" } };
      const xml = esocialService.gerarXML(evento);
      expect(xml).toContain("<?xml");
    });
  });
});
