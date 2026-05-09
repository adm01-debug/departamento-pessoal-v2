import { supabase } from '@/integrations/supabase/client';
import { calcularRescisao } from '@/utils/rescisaoCalc';
import { auditLogger } from '@/utils/auditLogger';

export const rescisaoService = {
  async calcularESalvar(id: string, params: any) {
    if (!id) throw new Error('ID do desligamento é obrigatório');

    // 1. Buscar dados atuais para o log
    const { data: anterior, error: fetchError } = await supabase
      .from('desligamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    // 2. Realizar o cálculo
    const resultado = calcularRescisao({
      salario: params.salario_base,
      dataAdmissao: params.data_admissao,
      dataDesligamento: params.data_desligamento,
      tipo: params.tipo,
      avisoTrabalhado: params.aviso_trabalhado,
      feriasVencidas: params.ferias_vencidas,
      saldoFGTS: params.saldo_fgts || 0,
    });

    // 3. Atualizar o registro de desligamento com os valores calculados
    const dadosAtualizados = {
      saldo_salario: resultado.saldoSalario,
      decimo_terceiro: resultado.decimoTerceiro,
      ferias_proporcionais: resultado.feriasProporcionais,
      ferias_vencidas: resultado.feriasVencidas,
      terco_constitucional: resultado.tercoFerias,
      aviso_previo: resultado.avisoIndenizado,
      multa_fgts: resultado.multaFGTS,
      total_proventos: resultado.totalProventos,
      total_descontos: resultado.totalDescontos,
      valor_liquido: resultado.totalLiquido,
      detalhes_calculo: resultado, // Armazena o objeto completo para rastreabilidade
      status: 'calculado',
      etapa: 'homologacao'
    };

    const { data: novo, error: updateError } = await supabase
      .from('desligamentos')
      .update(dadosAtualizados)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4. Log de Auditoria
    await auditLogger.log({
      tabela: 'desligamentos',
      registro_id: id,
      acao: 'EXECUTE_CALC',
      dados_anteriores: anterior,
      dados_novos: novo,
    });

    return novo;
  },

  async homologar(id: string) {
    const { data, error } = await supabase
      .from('desligamentos')
      .update({ status: 'homologado', etapa: 'pagamento', checklist_homologacao: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    await auditLogger.log({
      tabela: 'desligamentos',
      registro_id: id,
      acao: 'UPDATE',
      dados_novos: data,
    });

    return data;
  }
};
