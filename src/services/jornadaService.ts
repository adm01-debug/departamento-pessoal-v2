import { supabase } from "@/integrations/supabase/client";

export interface JornadaData {
  id?: string;
  codigo: string;
  descricao: string;
  horaInicio: string;
  horaFim: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  cargaHorariaDiaria: number;
  cargaHorariaSemanal: number;
  cargaHorariaMensal: number;
  tipo: string;
  diasSemana: number[];
  toleranciaEntrada: number;
  toleranciaSaida: number;
  permiteHoraExtra: boolean;
  permiteBancoHoras: boolean;
  ativo: boolean;
}

class JornadaService {
  private table = "jornadas";

  async getAll(filters?: Partial<JornadaData>): Promise<JornadaData[]> {
    let query = supabase.from(this.table).select("*");
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
    const { data, error } = await query.order("descricao");
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<JornadaData | null> {
    const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async getByCodigo(codigo: string): Promise<JornadaData | null> {
    const { data, error } = await supabase.from(this.table).select("*").eq("codigo", codigo).single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  async create(data: Omit<JornadaData, "id">): Promise<JornadaData> {
    const { data: result, error } = await supabase.from(this.table).insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<JornadaData>): Promise<JornadaData> {
    const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);
    if (error) throw error;
  }

  async count(filters?: Partial<JornadaData>): Promise<number> {
    let query = supabase.from(this.table).select("*", { count: "exact", head: true });
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  calcularCargaHoraria(horaInicio: string, horaFim: string, intervalo: number = 0): number {
    const [hi, mi] = horaInicio.split(":").map(Number);
    const [hf, mf] = horaFim.split(":").map(Number);
    const inicio = hi * 60 + mi;
    const fim = hf * 60 + mf;
    const total = (fim > inicio ? fim - inicio : 1440 - inicio + fim) - intervalo;
    return total / 60;
  }
}

export const jornadaService = new JornadaService();
export default jornadaService;
