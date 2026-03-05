// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
export interface EmprestimoData { id?: string; colaboradorId: string; tipo: string; bancoId?: string; contrato?: string; valorTotal: number; taxaJuros?: number; quantidadeParcelas: number; valorParcela: number; parcelasPagas: number; dataInicio: Date; dataFim?: Date; diaDesconto: number; margemUtilizada?: number; situacao: string; observacao?: string; }
class EmprestimoService {
  private table = "emprestimos";
  async getAll(filters?: Partial<EmprestimoData>): Promise<EmprestimoData[]> { let q = supabase.from(this.table).select("*"); if (filters) Object.entries(filters).forEach(([k,v]) => { if (v !== undefined) q = q.eq(k,v); }); const { data, error } = await q.order("data_inicio", { ascending: false }); if (error) throw error; return data || []; }
  async getById(id: string): Promise<EmprestimoData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async getByColaborador(colaboradorId: string): Promise<EmprestimoData[]> { return this.getAll({ colaboradorId }); }
  async getAtivos(): Promise<EmprestimoData[]> { return this.getAll({ situacao: "ATIVO" }); }
  async create(data: Omit<EmprestimoData, "id">): Promise<EmprestimoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<EmprestimoData>): Promise<EmprestimoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async registrarParcela(id: string): Promise<EmprestimoData> { const emp = await this.getById(id); if (!emp) throw new Error("Empréstimo não encontrado"); const novasPagas = emp.parcelasPagas + 1; const situacao = novasPagas >= emp.quantidadeParcelas ? "QUITADO" : "ATIVO"; return this.update(id, { parcelasPagas: novasPagas, situacao }); }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
}
export const emprestimoService = new EmprestimoService();
export default emprestimoService;
