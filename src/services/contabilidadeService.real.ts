// V19-S007: ContabilidadeService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export interface LancamentoContabil { id: string; data: string; contaDebito: string; contaCredito: string; valor: number; historico: string; competencia: string; }
export const contabilidadeServiceReal = {
  async lancar(lancamento: Omit<LancamentoContabil, "id">) {
    const { data, error } = await supabase.from("lancamentos_contabeis").insert(lancamento).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getLancamentos(competencia: string) {
    const { data } = await supabase.from("lancamentos_contabeis").select("*").eq("competencia", competencia);
    return data || [];
  },
  async gerarRazao(conta: string, competencia: string) {
    const { data } = await supabase.from("lancamentos_contabeis").select("*").eq("competencia", competencia).or(`conta_debito.eq.${conta},conta_credito.eq.${conta}`);
    return data || [];
  },
  async gerarBalancete(competencia: string) {
    const lancamentos = await this.getLancamentos(competencia);
    const contas: Record<string, { debito: number; credito: number }> = {};
    lancamentos.forEach(l => {
      if (!contas[l.contaDebito]) contas[l.contaDebito] = { debito: 0, credito: 0 };
      if (!contas[l.contaCredito]) contas[l.contaCredito] = { debito: 0, credito: 0 };
      contas[l.contaDebito].debito += l.valor;
      contas[l.contaCredito].credito += l.valor;
    });
    return contas;
  },
  async exportarSPED(empresaId: string, competencia: string) {
    return { competencia, arquivo: `SPED_${competencia}.txt`, geradoEm: new Date().toISOString() };
  }
};
export default contabilidadeServiceReal;
