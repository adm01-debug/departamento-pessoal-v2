import { supabase } from '@/integrations/supabase/client';
import { calcularRescisao } from '@/utils/rescisaoCalc';
import { auditLogger } from '@/utils/auditLogger';
import { Result, Ok, Err, toResult } from '@/types/result';

// Ordem lógica das etapas para validação
const ORDEM_ETAPAS = ['comunicacao', 'documentacao', 'calculo', 'homologacao', 'pagamento', 'finalizado'];

export const rescisaoService = {
  async validarTransicao(id: string, novaEtapa: string): Promise<Result<boolean>> {
    try {
      const { data: atual, error } = await supabase
        .from('desligamentos')
        .select('etapa, status')
        .eq('id', id)
        .single();
      
      if (error) return Err({
        type: 'DATABASE_ERROR',
        severity: 'error',
        message: 'Erro ao buscar dados do desligamento',
        timestamp: new Date()
      });
      
      const indexAtual = ORDEM_ETAPAS.indexOf(atual.etapa || 'comunicacao');
      const indexNova = ORDEM_ETAPAS.indexOf(novaEtapa);
      
      if (indexNova > indexAtual + 1) {
        return Err({
          type: 'VALIDATION_ERROR',
          severity: 'warning',
          message: `Transição bloqueada: Você deve concluir a etapa '${ORDEM_ETAPAS[indexAtual]}' e passar por '${ORDEM_ETAPAS[indexAtual + 1]}' antes de chegar em '${novaEtapa}'.`,
          timestamp: new Date()
        });
      }
      
      if (novaEtapa === 'homologacao' && atual.status !== 'calculado') {
        return Err({
          type: 'VALIDATION_ERROR',
          severity: 'warning',
          message: 'A rescisão precisa estar com status "calculado" para prosseguir para a homologação.',
          timestamp: new Date()
        });
      }

      return Ok(true);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Erro inesperado na validação de transição',
        timestamp: new Date()
      });
    }
  },

  async calcularESalvar(id: string, params: any): Promise<Result<any>> {
    if (!id) return Err({
      type: 'VALIDATION_ERROR',
      severity: 'error',
      message: 'ID do desligamento é obrigatório',
      timestamp: new Date()
    });

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
      if (!transitionResult.ok) return transitionResult;

      // 2. Realizar o cálculo
      const result = await calcularRescisao({
        salario: params.salario_base || (anterior as any).salario_base,
        dataAdmissao: (anterior.colaborador as any)?.data_admissao || params.data_admissao,
        dataDesligamento: params.data_desligamento || (anterior as any).data_desligamento,
        tipo: params.tipo || (anterior as any).tipo,
        avisoTrabalhado: params.aviso_trabalhado !== undefined ? params.aviso_trabalhado : (anterior as any).aviso_trabalhado,
        feriasVencidas: params.ferias_vencidas !== undefined ? params.ferias_vencidas : (anterior as any).ferias_vencidas_check,
        saldoFGTS: params.saldo_fgts !== undefined ? params.saldo_fgts : ((anterior as any).saldo_fgts || 0),
        dependentes: (anterior.colaborador as any)?.dependentes_irrf || 0,
      });

      if (!result.ok) return result;
      const resultado = result.value;

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

      return Ok(novo);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Erro crítico ao processar cálculo de rescisão',
        timestamp: new Date()
      });
    }
  },

  async homologar(id: string, etapa: 'rh' | 'financeiro' | 'juridico' | 'colaborador' = 'rh', parecer?: string): Promise<Result<any>> {
    try {
      const { data: d, error: fetchError } = await supabase
        .from('desligamentos')
        .select('valor_liquido, etapa, checklist_calculo_rescisao, status')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      if (!d.valor_liquido || !d.checklist_calculo_rescisao) {
        return Err({
          type: 'VALIDATION_ERROR',
          severity: 'warning',
          message: 'A homologação exige que o cálculo da rescisão tenha sido realizado e salvo primeiro.',
          timestamp: new Date()
        });
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

      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: e.message || 'Erro ao processar homologação',
        timestamp: new Date()
      });
    }
  },

  async assinarDigitalmente(id: string, tipo: 'empresa' | 'colaborador'): Promise<Result<any>> {
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

      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao realizar assinatura digital',
        timestamp: new Date()
      });
    }
  },

  async processarPagamento(id: string, comprovanteUrl?: string): Promise<Result<any>> {
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

      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: 'Erro ao processar pagamento de rescisão',
        timestamp: new Date()
      });
    }
  }
};


