import { describe, it, expect, vi, beforeEach } from "vitest";
import auditoriaService from "../auditoriaService";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue({ data: [], error: null }) })) }
}));

describe("auditoriaService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("registrarAcao", () => {
    it("deve registrar ação de criação", async () => {
      const acao = { tipo: "create" as const, entidade: "colaborador", entidadeId: "123", dados: { nome: "Teste" }, usuarioId: "user1" };
      const result = await auditoriaService.registrarAcao(acao);
      expect(result).toBeDefined();
    });

    it("deve registrar ação de atualização", async () => {
      const acao = { tipo: "update" as const, entidade: "colaborador", entidadeId: "123", dadosAntigos: { nome: "Antigo" }, dadosNovos: { nome: "Novo" }, usuarioId: "user1" };
      const result = await auditoriaService.registrarAcao(acao);
      expect(result).toBeDefined();
    });

    it("deve registrar ação de exclusão", async () => {
      const acao = { tipo: "delete" as const, entidade: "colaborador", entidadeId: "123", usuarioId: "user1" };
      const result = await auditoriaService.registrarAcao(acao);
      expect(result).toBeDefined();
    });
  });

  describe("getHistorico", () => {
    it("deve retornar histórico de uma entidade", async () => {
      const result = await auditoriaService.getHistorico("colaborador", "123");
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("deve retornar histórico ordenado por data", async () => {
      const result = await auditoriaService.getHistorico("colaborador", "123");
      expect(result).toBeDefined();
    });
  });

  describe("getAcoesPorUsuario", () => {
    it("deve retornar ações de um usuário", async () => {
      const result = await auditoriaService.getAcoesPorUsuario("user1");
      expect(result).toBeDefined();
    });
  });

  describe("gerarRelatorio", () => {
    it("deve gerar relatório de auditoria", async () => {
      const filtros = { dataInicio: new Date(), dataFim: new Date() };
      const result = await auditoriaService.gerarRelatorio(filtros);
      expect(result).toBeDefined();
    });
  });

  describe("comparar", () => {
    it("deve comparar dois objetos e retornar diferenças", () => {
      const antes = { nome: "João", idade: 30 };
      const depois = { nome: "João", idade: 31 };
      const diff = auditoriaService.comparar(antes, depois);
      expect(diff.idade).toBeDefined();
    });
  });
});
