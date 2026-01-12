// V19-S006: CNISService Real Expandido - Cadastro Nacional Informações Sociais
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export interface RegistroCNIS { nit: string; empregador: string; dataAdmissao: string; dataDemissao?: string; remuneracoes: { competencia: string; valor: number }[]; }
export const cnisServiceReal = {
  async consultar(cpf: string): Promise<RegistroCNIS[]> {
    // Simulação - em produção integrar com API gov.br
    return [];
  },
  async importarHistorico(colaboradorId: string, registros: RegistroCNIS[]) {
    const { data, error } = await supabase.from("historico_cnis").insert(registros.map(r => ({ colaborador_id: colaboradorId, ...r }))).select();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async calcularTempoContribuicao(cpf: string) {
    const registros = await this.consultar(cpf);
    let meses = 0;
    registros.forEach(r => {
      const inicio = new Date(r.dataAdmissao);
      const fim = r.dataDemissao ? new Date(r.dataDemissao) : new Date();
      meses += Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    });
    return { totalMeses: meses, anos: Math.floor(meses / 12), mesesRestantes: meses % 12 };
  },
  validarNIT: (nit: string) => /^\d{11}$/.test(nit.replace(/\D/g, ""))
};
export default cnisServiceReal;
