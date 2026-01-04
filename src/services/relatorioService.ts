import { supabase } from "@/integrations/supabase/client";

export interface RelatorioConfig { tipo: string; titulo: string; filtros: Record<string, any>; formato: "pdf" | "xlsx" | "csv"; periodo?: { inicio: string; fim: string }; }
export interface RelatorioResult { id: string; titulo: string; geradoEm: string; tamanho: number; downloadUrl?: string; status: "pendente" | "processando" | "concluido" | "erro"; erro?: string; }

class RelatorioService {
  private relatorios: RelatorioResult[] = [];

  async gerar(config: RelatorioConfig): Promise<RelatorioResult> {
    const rel: RelatorioResult = { id: crypto.randomUUID(), titulo: config.titulo, geradoEm: new Date().toISOString(), tamanho: 0, status: "processando" };
    this.relatorios.push(rel);
    setTimeout(async () => { rel.status = "concluido"; rel.tamanho = Math.floor(Math.random() * 100000); }, 1000);
    return rel;
  }

  async gerarFolhaPagamento(competencia: string): Promise<RelatorioResult> { return this.gerar({ tipo: "folha", titulo: `Folha de Pagamento - ${competencia}`, filtros: { competencia }, formato: "pdf" }); }
  async gerarListaColaboradores(filtros?: Record<string, any>): Promise<RelatorioResult> { return this.gerar({ tipo: "colaboradores", titulo: "Lista de Colaboradores", filtros: filtros || {}, formato: "xlsx" }); }
  async gerarRelatorioFerias(ano: number): Promise<RelatorioResult> { return this.gerar({ tipo: "ferias", titulo: `Relatório de Férias - ${ano}`, filtros: { ano }, formato: "pdf" }); }
  async gerarRelatorioPonto(periodo: { inicio: string; fim: string }): Promise<RelatorioResult> { return this.gerar({ tipo: "ponto", titulo: "Relatório de Ponto", filtros: {}, formato: "pdf", periodo }); }
  async gerarRelatorioTurnover(periodo: { inicio: string; fim: string }): Promise<RelatorioResult> { return this.gerar({ tipo: "turnover", titulo: "Relatório de Turnover", filtros: {}, formato: "pdf", periodo }); }
  async gerarRelatorioAbsenteismo(periodo: { inicio: string; fim: string }): Promise<RelatorioResult> { return this.gerar({ tipo: "absenteismo", titulo: "Relatório de Absenteísmo", filtros: {}, formato: "pdf", periodo }); }
  async gerarRelatorioEncargos(competencia: string): Promise<RelatorioResult> { return this.gerar({ tipo: "encargos", titulo: `Relatório de Encargos - ${competencia}`, filtros: { competencia }, formato: "xlsx" }); }
  async gerarRelatorioProvisoes(competencia: string): Promise<RelatorioResult> { return this.gerar({ tipo: "provisoes", titulo: `Relatório de Provisões - ${competencia}`, filtros: { competencia }, formato: "xlsx" }); }

  async listar(): Promise<RelatorioResult[]> { return [...this.relatorios].reverse(); }
  async obter(id: string): Promise<RelatorioResult | null> { return this.relatorios.find(r => r.id === id) || null; }
  async excluir(id: string): Promise<boolean> { const idx = this.relatorios.findIndex(r => r.id === id); if (idx > -1) { this.relatorios.splice(idx, 1); return true; } return false; }

  getTiposDisponiveis(): { value: string; label: string }[] {
    return [
      { value: "folha", label: "Folha de Pagamento" },
      { value: "colaboradores", label: "Lista de Colaboradores" },
      { value: "ferias", label: "Relatório de Férias" },
      { value: "ponto", label: "Relatório de Ponto" },
      { value: "turnover", label: "Relatório de Turnover" },
      { value: "absenteismo", label: "Relatório de Absenteísmo" },
      { value: "encargos", label: "Relatório de Encargos" },
      { value: "provisoes", label: "Relatório de Provisões" },
    ];
  }
}

export const relatorioService = new RelatorioService();
export default relatorioService;
