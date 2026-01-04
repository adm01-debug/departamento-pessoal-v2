import { supabase } from "@/integrations/supabase/client";

export interface AdmissaoData {
  id?: string;
  colaboradorId?: string;
  dataAdmissao?: Date;
  cargo?: string;
  departamento?: string;
  salario?: number;
  tipoContrato?: string;
  status?: string;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class AdmissaoService {
  private tableName = "admissoes";

  async getAll(filters?: Record<string, any>): Promise<AdmissaoData[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<AdmissaoData | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async create(data: Omit<AdmissaoData, "id">): Promise<AdmissaoData> {
    const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<AdmissaoData>): Promise<AdmissaoData> {
    const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw error;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).select("*", { count: "exact", head: true });
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
}

export const admissaoService = new AdmissaoService();
export default admissaoService;
