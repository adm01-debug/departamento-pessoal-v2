export interface SapConfig { baseUrl: string; token: string; empresa: string; filial?: string; }
export interface Colaborador { id: string; nome: string; cpf: string; cargo: string; departamento: string; salario: number; dataAdmissao: string; }
class SapService {
  private config: SapConfig | null = null;
  configurar(config: SapConfig): void { this.config = config; }
  private getHeaders(): HeadersInit { if (!this.config) throw new Error("Sap não configurado"); return { "Authorization": `Bearer ${this.config.token}`, "Content-Type": "application/json" }; }
  async listarColaboradores(): Promise<Colaborador[]> { const r = await fetch(`${this.config!.baseUrl}/colaboradores`, { headers: this.getHeaders() }); if (!r.ok) throw new Error("Falha ao listar"); return r.json(); }
  async buscarColaborador(id: string): Promise<Colaborador | null> { const r = await fetch(`${this.config!.baseUrl}/colaboradores/${id}`, { headers: this.getHeaders() }); if (!r.ok) return null; return r.json(); }
  async sincronizarColaboradores(colaboradores: Colaborador[]): Promise<{ sucesso: number; erros: number }> { let sucesso = 0, erros = 0; for (const c of colaboradores) { try { await fetch(`${this.config!.baseUrl}/colaboradores`, { method: "POST", headers: this.getHeaders(), body: JSON.stringify(c) }); sucesso++; } catch { erros++; } } return { sucesso, erros }; }
  async enviarFolhaPagamento(competencia: string, dados: any[]): Promise<{ loteId: string }> { const r = await fetch(`${this.config!.baseUrl}/folha/${competencia}`, { method: "POST", headers: this.getHeaders(), body: JSON.stringify({ dados }) }); if (!r.ok) throw new Error("Falha ao enviar folha"); return r.json(); }
  async consultarStatusIntegracao(loteId: string): Promise<{ status: string; processados: number; erros: number }> { const r = await fetch(`${this.config!.baseUrl}/integracoes/${loteId}`, { headers: this.getHeaders() }); if (!r.ok) throw new Error("Falha ao consultar"); return r.json(); }
}
export const sapService = new SapService();
export default sapService;
