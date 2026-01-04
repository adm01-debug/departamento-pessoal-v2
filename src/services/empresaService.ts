import { supabase } from "@/integrations/supabase/client";
export interface EmpresaData { id?: string; razaoSocial?: string; nomeFantasia?: string; cnpj?: string; inscricaoEstadual?: string; ativo?: boolean; }
class EmpresaService {
  private tableName = "empresas";
  async getAll(filters?: Record<string, any>): Promise<EmpresaData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<EmpresaData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<EmpresaData, "id">): Promise<EmpresaData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<EmpresaData>): Promise<EmpresaData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const empresaService = new EmpresaService();
export default empresaService;
