// V18-S007: DIRFService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export interface InformeRendimentos {
  anoCalendario: number;
  colaboradorId: string;
  rendimentosTributaveis: number;
  irrfRetido: number;
  contribuicaoPrevidenciaria: number;
  pensaoAlimenticia: number;
  dependentes: number;
}

export const dirfServiceReal = {
  async getRendimentos(colaboradorId: string, anoCalendario: number) {
    const { data, error } = await supabase
      .from("folha_pagamento")
      .select("*")
      .eq("colaborador_id", colaboradorId)
      .gte("competencia", `${anoCalendario}-01`)
      .lte("competencia", `${anoCalendario}-12`);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async gerarInforme(colaboradorId: string, anoCalendario: number): Promise<InformeRendimentos> {
    const rendimentos = await this.getRendimentos(colaboradorId, anoCalendario);
    return {
      anoCalendario,
      colaboradorId,
      rendimentosTributaveis: rendimentos.reduce((acc, r) => acc + (r.total_bruto || 0), 0),
      irrfRetido: rendimentos.reduce((acc, r) => acc + (r.irrf || 0), 0),
      contribuicaoPrevidenciaria: rendimentos.reduce((acc, r) => acc + (r.inss || 0), 0),
      pensaoAlimenticia: rendimentos.reduce((acc, r) => acc + (r.pensao || 0), 0),
      dependentes: rendimentos[0]?.dependentes || 0
    };
  },

  async gerarArquivoDIRF(empresaId: string, anoCalendario: number) {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id, nome, cpf")
      .eq("empresa_id", empresaId);
    
    const informes = await Promise.all(
      (colaboradores || []).map(c => this.gerarInforme(c.id, anoCalendario))
    );

    return {
      anoCalendario,
      empresaId,
      totalBeneficiarios: colaboradores?.length || 0,
      totalRendimentos: informes.reduce((acc, i) => acc + i.rendimentosTributaveis, 0),
      totalIRRF: informes.reduce((acc, i) => acc + i.irrfRetido, 0),
      arquivo: `DIRF_${anoCalendario}.txt`,
      geradoEm: new Date().toISOString()
    };
  },

  validarInforme: (informe: InformeRendimentos) => ({
    valido: informe.rendimentosTributaveis >= 0 && informe.irrfRetido >= 0,
    erros: []
  })
};

export default dirfServiceReal;
