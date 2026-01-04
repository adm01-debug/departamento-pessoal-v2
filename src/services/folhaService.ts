import { supabase } from "@/integrations/supabase/client";
export interface FolhaData { id?: string; colaboradorId?: string; competencia?: string; salarioBruto?: number; descontos?: number; salarioLiquido?: number; status?: string; }
class FolhaService {
  private tableName = "folhas";
  async getAll(filters?: Record<string, any>): Promise<FolhaData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<FolhaData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<FolhaData, "id">): Promise<FolhaData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<FolhaData>): Promise<FolhaData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const folhaService = new FolhaService();
export default folhaService;
