import { supabase } from '@/integrations/supabase/client';
import { calcularRescisao } from '@/utils/rescisaoCalc';
import { auditLogger } from '@/utils/auditLogger';
// Ordem lógica das etapas para validação
const ORDEM_ETAPAS = ['comunicacao', 'documentacao', 'calculo', 'homologacao', 'pagamento', 'finalizado'];

export const rescisaoService = {
  async validarTransicao(id: string, novaEtapa: string): Promise<boolean> {
    try {
      const { data: atual, error } = await supabase
        .from('desligamentos')
        .select('etapa, status')
        .eq('id', id)
        .single();
      
      if (error) throw new Error('Erro ao buscar dados do desligamento');
      
      const indexAtual = ORDEM_ETAPAS.indexOf(atual.etapa || 'comunicacao');
      const indexNova = ORDEM_ETAPAS.indexOf(novaEtapa);
      
      if (indexNova > indexAtual + 1) {
        throw new Error(`Transição bloqueada: Você deve concluir a etapa '${ORDEM_ETAPAS[indexAtual]}' e passar por '${ORDEM_ETAPAS[indexAtual + 1]}' antes de chegar em '${novaEtapa}'.`);
      }
      
      if (novaEtapa === 'homologacao' && atual.status !== 'calculado') {
        throw new Error('A rescisão precisa estar com status "calculado" para prosseguir para a homologação.');
      }

      return (true);
    } catch (e: any) {
      throw new Error(e.message || 'Erro inesperado na validação de transição');
    }
  },

  async calcularESalvar(id: string, params: any): Promise<unknown> {
    if (!id) throw new Error('ID do desligamento é obrigatório');

    try {
      // 1. Buscar dados atuais para o log e validar transição
      const { data: anterior, error: fetchError } = await supabase
        .from('desligamentos')
        .select('*, colaborador:colaboradores!desligamentos_colaborador_id_fkey(nome_completo, data_admissao, dependentes_irrf)')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      // Validar se pode ir para a etapa de cálculo
      const transitionResult = await this.validarTransicao(id, 'calculo');

      // 2. Realizar o cálculo
      const result = await calcularRescisao({
        salario: params.salario_base || (anterior as Record<string, unknown>).salario_base,
        dataAdmissao: (anterior.colaborador as any)?.data_admissao || params.data_admissao,
        dataDesligamento: params.data_desligamento || (anterior as Record<string, unknown>).data_desligamento,
        tipo: params.tipo || (anterior as Record<string, unknown>).tipo,
        avisoTrabalhado: params.aviso_trabalhado !== undefined ? params.aviso_trabalhado : (anterior as Record<string, unknown>).aviso_trabalhado,
        feriasVencidas: params.ferias_vencidas !== undefined ? params.ferias_vencidas : (anterior as Record<string, unknown>).ferias_vencidas_check,
        saldoFGTS: params.saldo_fgts !== undefined ? params.saldo_fgts : ((anterior as Record<string, unknown>).saldo_fgts || 0),
        dependentes: (anterior.colaborador as any)?.dependentes_irrf || 0,
      });
      const resultado = result;

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
        checklist_calculo_rescisao: true
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

      return (novo);
    } catch (e: any) {
      throw new Error(e.message || 'Erro crítico ao processar cálculo de rescisão');
    }
  },

  async homologar(id: string, etapa: 'rh' | 'financeiro' | 'juridico' | 'colaborador' = 'rh', parecer?: string): Promise<unknown> {
    try {
      const { data: d, error: fetchError } = await supabase
        .from('desligamentos')
        .select('valor_liquido, etapa, checklist_calculo_rescisao, status')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      if (!d.valor_liquido || !d.checklist_calculo_rescisao) {
        throw new Error('A homologação exige que o cálculo da rescisão tenha sido realizado e salvo primeiro.');
      }

      // Registrar aprovação
      const { error: homError } = await supabase
        .from('homologacoes_rescisao')
        .insert({
          desligamento_id: id,
          etapa,
          status: 'aprovado',
          parecer,
          data_decisao: new Date().toISOString()
        });

      if (homError) throw homError;

      const proximaEtapa = etapa === 'rh' ? 'financeiro' : etapa === 'financeiro' ? 'juridico' : etapa === 'juridico' ? 'colaborador' : 'finalizado';
      const novoStatus = proximaEtapa === 'finalizado' ? 'homologado' : 'em_homologacao';

      const { data, error } = await supabase
        .from('desligamentos')
        .update({ 
          status: novoStatus, 
          etapa: proximaEtapa === 'finalizado' ? 'pagamento' : 'homologacao', 
          checklist_homologacao: proximaEtapa === 'finalizado'
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
          status: novoStatus, 
          etapa: proximaEtapa, 
          evento: 'HOMOLOGACAO_PARCIAL',
          etapa_concluida: etapa,
          timestamp: new Date().toISOString()
        },
      });

      return (data);
    } catch (e: any) {
      throw new Error(e.message || 'Erro ao processar homologação');
    }
  },

  async assinarDigitalmente(id: string, tipo: 'empresa' | 'colaborador'): Promise<unknown> {
    try {
      const hash = btoa(`rescisao-${id}-${tipo}-${new Date().getTime()}`).slice(0, 32);
      const updateData: any = {};
      
      if (tipo === 'empresa') {
        updateData.assinado_empresa = true;
        updateData.hash_assinatura_empresa = hash;
        updateData.data_assinatura_empresa = new Date().toISOString();
      } else {
        updateData.assinado_colaborador = true;
        updateData.hash_assinatura_colaborador = hash;
        updateData.data_assinatura_colaborador = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('desligamentos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await auditLogger.log({
        tabela: 'desligamentos',
        registro_id: id,
        acao: 'SIGN',
        dados_novos: { tipo_assinatura: tipo, hash }
      });

      return (data);
    } catch (e: any) {
      throw new Error('Falha ao realizar assinatura digital');
    }
  },

  async processarPagamento(id: string, comprovanteUrl?: string): Promise<unknown> {
    try {
      const { data: d, error: fetchError } = await supabase
        .from('desligamentos')
        .select('colaborador_id, data_desligamento, valor_liquido')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('desligamentos')
        .update({ 
          status: 'pago', 
          etapa: 'finalizado',
          checklist_pagamento: true,
          data_pagamento: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { error: colabError } = await supabase
        .from('colaboradores')
        .update({ 
          status: 'desligado',
          data_desligamento: d.data_desligamento
        })
        .eq('id', d.colaborador_id);

      if (colabError) console.error('Erro ao desativar colaborador:', colabError);

      await auditLogger.log({
        tabela: 'desligamentos',
        registro_id: id,
        acao: 'UPDATE',
        dados_novos: { status: 'pago', etapa: 'finalizado', colaborador_desativado: true },
      });

      return (data);
    } catch (e: any) {
      throw new Error('Erro ao processar pagamento de rescisão');
    }
  }
};


