import { supabase } from "@/integrations/supabase/client";
export interface LotacaoData { id?: string; codigo: string; descricao: string; tipo: string; empresaId: string; lotacaoPaiId?: string; codigoContabil?: string; responsavelId?: string; codigoESocial?: string; ativo: boolean; }
class LotacaoService {
  private table = "lotacoes";
  async getAll(filters?: Partial<LotacaoData>): Promise<LotacaoData[]> { let q = supabase.from(this.table).select("*"); if (filters) Object.entries(filters).forEach(([k,v]) => { if (v !== undefined) q = q.eq(k,v); }); const { data, error } = await q.order("descricao"); if (error) throw error; return data || []; }
  async getById(id: string): Promise<LotacaoData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async getHierarchy(empresaId: string): Promise<LotacaoData[]> { const { data, error } = await supabase.from(this.table).select("*").eq("empresa_id", empresaId).order("codigo"); if (error) throw error; return data || []; }
  async create(data: Omit<LotacaoData, "id">): Promise<LotacaoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<LotacaoData>): Promise<LotacaoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
}
export const lotacaoService = new LotacaoService();
export default lotacaoService;
