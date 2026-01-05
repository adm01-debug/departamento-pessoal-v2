import { supabase } from "@/integrations/supabase/client";
export interface RubricaData { id?: string; codigo: string; descricao: string; tipo: string; natureza: string; incideINSS: boolean; incideIRRF: boolean; incideFGTS: boolean; incideFerias: boolean; incide13: boolean; codigoESocial?: string; formula?: string; ativo: boolean; }
class RubricaService {
  private table = "rubricas";
  async getAll(filters?: Partial<RubricaData>): Promise<RubricaData[]> { let q = supabase.from(this.table).select("*"); if (filters) Object.entries(filters).forEach(([k,v]) => { if (v !== undefined) q = q.eq(k,v); }); const { data, error } = await q.order("codigo"); if (error) throw error; return data || []; }
  async getById(id: string): Promise<RubricaData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async getByCodigo(codigo: string): Promise<RubricaData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("codigo", codigo).single(); if (error && error.code !== "PGRST116") throw error; return data; }
  async getProventos(): Promise<RubricaData[]> { return this.getAll({ tipo: "PROVENTO", ativo: true }); }
  async getDescontos(): Promise<RubricaData[]> { return this.getAll({ tipo: "DESCONTO", ativo: true }); }
  async create(data: Omit<RubricaData, "id">): Promise<RubricaData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<RubricaData>): Promise<RubricaData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
}
export const rubricaService = new RubricaService();
export default rubricaService;
