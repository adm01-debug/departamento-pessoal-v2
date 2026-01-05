import { supabase } from "@/integrations/supabase/client";
export interface VinculoData { id?: string; colaboradorId: string; empresaId: string; tipoVinculo: string; dataAdmissao: Date; dataDesligamento?: Date; matricula: string; cargoId: string; departamentoId: string; jornadaId?: string; salarioBase: number; tipoSalario: string; formaPagamento: string; contaBancaria?: string; categoriaESocial: string; sindicatoId?: string; ativo: boolean; }
class VinculoService {
  private table = "vinculos";
  async getAll(filters?: Partial<VinculoData>): Promise<VinculoData[]> { let q = supabase.from(this.table).select("*"); if (filters) Object.entries(filters).forEach(([k,v]) => { if (v !== undefined) q = q.eq(k,v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<VinculoData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async getByColaborador(colaboradorId: string): Promise<VinculoData[]> { const { data, error } = await supabase.from(this.table).select("*").eq("colaborador_id", colaboradorId); if (error) throw error; return data || []; }
  async create(data: Omit<VinculoData, "id">): Promise<VinculoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<VinculoData>): Promise<VinculoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
}
export const vinculoService = new VinculoService();
export default vinculoService;
