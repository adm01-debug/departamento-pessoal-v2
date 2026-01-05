import { supabase } from "@/integrations/supabase/client";
export interface FeriadoData { id?: string; data: Date; descricao: string; tipo: string; uf?: string; municipioId?: string; recorrente: boolean; ativo: boolean; }
class FeriadoService {
  private table = "feriados";
  async getAll(): Promise<FeriadoData[]> { const { data, error } = await supabase.from(this.table).select("*").order("data"); if (error) throw error; return data || []; }
  async getByAno(ano: number): Promise<FeriadoData[]> { const inicio = `${ano}-01-01`; const fim = `${ano}-12-31`; const { data, error } = await supabase.from(this.table).select("*").gte("data", inicio).lte("data", fim).order("data"); if (error) throw error; return data || []; }
  async create(data: Omit<FeriadoData, "id">): Promise<FeriadoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<FeriadoData>): Promise<FeriadoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
  async verificarFeriado(data: Date, uf?: string): Promise<FeriadoData | null> { const { data: result } = await supabase.from(this.table).select("*").eq("data", data.toISOString().split("T")[0]).or(`tipo.eq.NACIONAL,uf.eq.${uf}`).single(); return result; }
}
export const feriadoService = new FeriadoService();
export default feriadoService;
