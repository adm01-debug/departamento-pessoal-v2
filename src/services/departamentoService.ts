import { supabase } from "@/integrations/supabase/client";
export interface DepartamentoData { id?: string; nome?: string; descricao?: string; codigo?: string; responsavel?: string; ativo?: boolean; }
class DepartamentoService {
  private tableName = "departamentos";
  async getAll(filters?: Record<string, any>): Promise<DepartamentoData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<DepartamentoData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<DepartamentoData, "id">): Promise<DepartamentoData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<DepartamentoData>): Promise<DepartamentoData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const departamentoService = new DepartamentoService();
export default departamentoService;
