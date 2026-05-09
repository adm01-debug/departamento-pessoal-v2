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
    
    // Bloqueia saltar etapas (não permite ir de comunicacao direto para calculado sem passar por documentacao)
    if (indexNova > indexAtual + 1) {
      throw new Error(`Transição inválida: A etapa '${novaEtapa}' exige que a etapa anterior '${ORDEM_ETAPAS[indexNova-1]}' esteja concluída.`);
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
      salario: params.salario_base,
      dataAdmissao: (anterior.colaborador as any)?.data_admissao || params.data_admissao,

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

