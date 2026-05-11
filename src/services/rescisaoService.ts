import { supabase } from '@/integrations/supabase/client';
import { calcularRescisao } from '@/utils/rescisaoCalc';
import { auditLogger } from '@/utils/auditLogger';

// Ordem lógica das etapas para validação
const ORDEM_ETAPAS = ['comunicacao', 'documentacao', 'calculo', 'homologacao', 'pagamento', 'finalizado'];

export const rescisaoService = {
  async validarTransicao(id: string, novaEtapa: string) {
    const { data: atual, error } = await supabase
      .from('desligamentos')
      .select('etapa, status')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const indexAtual = ORDEM_ETAPAS.indexOf(atual.etapa || 'comunicacao');
    const indexNova = ORDEM_ETAPAS.indexOf(novaEtapa);
    
    // Bloqueia saltar etapas ou voltar etapas sem autorização explícita (Opcional, mas recomendado para consistência)
    if (indexNova > indexAtual + 1) {
      throw new Error(`Transição bloqueada: Você deve concluir a etapa '${ORDEM_ETAPAS[indexAtual]}' e passar por '${ORDEM_ETAPAS[indexAtual + 1]}' antes de chegar em '${novaEtapa}'.`);
    }
    
    // Validação específica: Para ir de cálculo para homologação, precisa ter valor líquido
    if (novaEtapa === 'homologacao' && atual.status !== 'calculado') {
       throw new Error('A rescisão precisa estar com status "calculado" para prosseguir para a homologação.');
    }

    
    return true;
  },


  async calcularESalvar(id: string, params: any) {
    if (!id) throw new Error('ID do desligamento é obrigatório');

    // 1. Buscar dados atuais para o log e validar transição
    const { data: anterior, error: fetchError } = await supabase
      .from('desligamentos')
      .select('*, colaborador:colaboradores!desligamentos_colaborador_id_fkey(nome_completo, data_admissao)')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    // Validar se pode ir para a etapa de cálculo
    await this.validarTransicao(id, 'calculo');

    // 2. Realizar o cálculo
    const resultado = calcularRescisao({
      salario: params.salario_base || anterior.salario_base,
      dataAdmissao: (anterior.colaborador as any)?.data_admissao || params.data_admissao,
      dataDesligamento: params.data_desligamento || anterior.data_desligamento,
      tipo: params.tipo || anterior.tipo,
      avisoTrabalhado: params.aviso_trabalhado !== undefined ? params.aviso_trabalhado : anterior.aviso_trabalhado,
      feriasVencidas: params.ferias_vencidas !== undefined ? params.ferias_vencidas : anterior.ferias_vencidas_check,
      saldoFGTS: params.saldo_fgts !== undefined ? params.saldo_fgts : (anterior.saldo_fgts || 0),
      dependentes: (anterior.colaborador as any)?.dependentes_irrf || 0,
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
      detalhes_calculo: resultado,
      status: 'calculado',
      etapa: 'homologacao',
      checklist_calculo_rescisao: true // Atualiza automaticamente o checklist
    };

    const { data: novo, error: updateError } = await supabase
      .from('desligamentos')
      .update(dadosAtualizados)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4. Log de Auditoria robusto
    await auditLogger.log({
      tabela: 'desligamentos',
      registro_id: id,
      acao: 'EXECUTE_CALC',
      dados_anteriores: { etapa: anterior.etapa, status: anterior.status },
      dados_novos: { 
        etapa: novo.etapa, 
        status: novo.status, 
        valor_liquido: novo.valor_liquido,
        hash_integridade: btoa(JSON.stringify(resultado)).slice(0, 32)
      },
    });

    return novo;
  },

  async homologar(id: string) {
    // Buscar desligamento para validar se o cálculo já foi feito
    const { data: d, error: fetchError } = await supabase
      .from('desligamentos')
      .select('valor_liquido, etapa, checklist_calculo_rescisao')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    if (!d.valor_liquido || !d.checklist_calculo_rescisao) {
      throw new Error('A homologação exige que o cálculo da rescisão tenha sido realizado e salvo primeiro.');
    }

    await this.validarTransicao(id, 'homologacao');

    const { data, error } = await supabase
      .from('desligamentos')
      .update({ 
        status: 'homologado', 
        etapa: 'pagamento', 
        checklist_homologacao: true 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    await auditLogger.log({
      tabela: 'desligamentos',
      registro_id: id,
      acao: 'UPDATE',
      dados_novos: { 
        status: 'homologado', 
        etapa: 'pagamento', 
        evento: 'HOMOLOGACAO_CONCLUIDA',
        timestamp_assinatura: new Date().toISOString()
      },
    });

    return data;
  }

};

