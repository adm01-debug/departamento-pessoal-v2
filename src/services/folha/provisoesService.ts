import { supabase } from '@/integrations/supabase/client';

export const provisoesService = {
  /**
   * Calcula as provisões mensais (1/12 de férias + 1/3 e 1/12 de 13º)
   */
  calcularProvisoesMensais: async (empresaId: string, competencia: string) => {
    // 1. Busca colaboradores ativos
    const { data: colaboradores } = await supabase
      .from('colaboradores')
      .select('id, salario_base, nome_completo')
      .eq('empresa_id', empresaId)
      .eq('status', 'ativo');

    if (!colaboradores) return;

    for (const colab of colaboradores) {
      const salario = Number(colab.salario_base || 0);
      
      // Provisão 13º (1/12 do salário) - Arredondado para 2 casas decimais
      const provisao13 = Math.round((salario / 12) * 100) / 100;
      
      // Provisão Férias (1/12 do salário + 1/3 constitucional)
      const provisaoFerias = Math.round(((salario / 12) * (4/3)) * 100) / 100;

      // FGTS sobre as provisões (8%)
      const fgtsProvisao = Math.round(((provisao13 + provisaoFerias) * 0.08) * 100) / 100;

      await (supabase as any).from('provisoes_folha').upsert({
        colaborador_id: colab.id,
        empresa_id: empresaId,
        competencia,
        valor_13_salario: provisao13,
        valor_ferias: provisaoFerias,
        encargos_provisao: fgtsProvisao,
        detalhes: { 
          salario_base: salario, 
          tipo_calculo: 'linear_12_avos', 
          timestamp: new Date().toISOString() 
        }
      }, { onConflict: 'colaborador_id,competencia' });
    }

    return true;
  }
};
