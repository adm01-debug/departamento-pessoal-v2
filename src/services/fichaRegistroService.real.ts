// V19-S009: FichaRegistroService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export const fichaRegistroServiceReal = {
  async gerar(colaboradorId: string) {
    const { data: colaborador } = await supabase.from("colaboradores").select("*, contratos(*), dependentes(*), documentos(*)").eq("id", colaboradorId).single();
    if (!colaborador) throw new Error("Colaborador não encontrado");
    return {
      colaborador,
      geradoEm: new Date().toISOString(),
      versao: "1.0",
      status: "completa"
    };
  },
  async gerarPDF(colaboradorId: string) {
    const ficha = await this.gerar(colaboradorId);
    return { colaboradorId, arquivo: `FICHA_${colaboradorId}.pdf`, ficha };
  },
  async listarAlteracoes(colaboradorId: string) {
    const { data } = await supabase.from("historico_alteracoes").select("*").eq("colaborador_id", colaboradorId).order("created_at", { ascending: false });
    return data || [];
  },
  async registrarAlteracao(colaboradorId: string, campo: string, valorAntigo: string, valorNovo: string) {
    const { data, error } = await supabase.from("historico_alteracoes").insert({ colaborador_id: colaboradorId, campo, valor_antigo: valorAntigo, valor_novo: valorNovo }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  validarFicha: (ficha: any) => ({ completa: !!(ficha.colaborador?.cpf && ficha.colaborador?.nome), pendencias: [] })
};
export default fichaRegistroServiceReal;
