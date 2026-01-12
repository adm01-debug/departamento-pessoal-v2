// V19-S002: AcordoTrabalhistaService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export type TipoAcordo = "reducao_jornada" | "suspensao_contrato" | "banco_horas" | "compensacao" | "prorrogacao";
export interface Acordo { id: string; colaboradorId: string; tipo: TipoAcordo; dataInicio: string; dataFim: string; descricao: string; status: "ativo" | "encerrado" | "cancelado"; }
export const acordoTrabalhistaServiceReal = {
  async criar(dados: Omit<Acordo, "id">) {
    const { data, error } = await supabase.from("acordos_trabalhistas").insert(dados).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async listar(colaboradorId?: string) {
    let query = supabase.from("acordos_trabalhistas").select("*");
    if (colaboradorId) query = query.eq("colaborador_id", colaboradorId);
    const { data, error } = await query.order("data_inicio", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async atualizar(id: string, dados: Partial<Acordo>) {
    const { data, error } = await supabase.from("acordos_trabalhistas").update(dados).eq("id", id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async encerrar(id: string) { return this.atualizar(id, { status: "encerrado" }); },
  async cancelar(id: string) { return this.atualizar(id, { status: "cancelado" }); },
  async getAtivos() {
    const { data } = await supabase.from("acordos_trabalhistas").select("*").eq("status", "ativo");
    return data || [];
  },
  validar: (acordo: Partial<Acordo>) => ({
    valido: !!(acordo.colaboradorId && acordo.tipo && acordo.dataInicio),
    erros: []
  })
};
export default acordoTrabalhistaServiceReal;
