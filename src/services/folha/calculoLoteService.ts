import { supabase } from '@/integrations/supabase/client';
import { folhaCalc } from '@/utils/folhaCalc';
import { toast } from 'sonner';

export interface BatchProgress {
  total: number;
  current: number;
  success: number;
  errors: number;
}

export const calculoLoteService = {
  /**
   * Processa a folha de pagamento de todos os colaboradores ativos de uma empresa
   */
  processarLote: async (
    empresaId: string, 
    competencia: string,
    onProgress?: (progress: BatchProgress) => void
  ) => {
    try {
      // 1. Buscar colaboradores ativos da empresa
      const { data: colaboradores, error: colabError } = await (supabase as any)
        .from('colaboradores')
        .select(`
          *,
          dependentes (id),
          eventos_variaveis (codigo, descricao, tipo, valor)
        `)
        .eq('empresa_id', empresaId)
        .eq('status', 'ativo');

      if (colabError) throw colabError;
      if (!colaboradores || colaboradores.length === 0) {
        throw new Error('Nenhum colaborador ativo encontrado para esta empresa.');
      }

      // 2. Garantir cabeçalho da folha
      let { data: header, error: headerError } = await (supabase as any)
        .from('folhas_pagamento')
        .select('id, status')
        .eq('empresa_id', empresaId)
        .eq('competencia', competencia)
        .maybeSingle();

      if (headerError) throw headerError;
      
      if (header && header.status === 'fechada') {
        throw new Error('A folha desta competência já está fechada e não pode ser recalculada.');
      }

      let folhaId = header?.id;
      if (!folhaId) {
        const { data: newHeader, error: createError } = await (supabase as any)
          .from('folhas_pagamento')
          .insert({
            empresa_id: empresaId,
            competencia,
            status: 'aberta',
            tipo: 'Mensal'
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        folhaId = newHeader.id;
      }

      const progress: BatchProgress = {
        total: colaboradores.length,
        current: 0,
        success: 0,
        errors: 0
      };

      // 3. Processar cada colaborador
      for (const colab of colaboradores) {
        try {
          const dependentesCount = colab.dependentes?.length || 0;
          const eventosVariaveis = colab.eventos_variaveis || [];

          // 3.1 Integrar dados de PONTO ELETRÔNICO (Horas Extras e Faltas Aprovadas)
          const { data: registrosPonto } = await (supabase as any)
            .from('registros_ponto')
            .select('horas_extras, horas_falta')
            .eq('colaborador_id', colab.id)
            .eq('aprovado', true)
            .gte('data', dataInicio)
            .lte('data', dataFim);
          
          let totalHE = 0;
          let totalFaltas = 0;
          
          if (registrosPonto) {
            registrosPonto.forEach((r: any) => {
              totalHE += pontoIntegracaoUtils.intervalToDecimal(r.horas_extras);
              totalFaltas += pontoIntegracaoUtils.intervalToDecimal(r.horas_falta);
            });
          }

          const res = folhaCalc.processar(Number(colab.salario_base || 0), {
            dependentes: dependentesCount,
            eventos: eventosVariaveis,
            horasExtras50: totalHE, // Assumindo 50% por padrão na integração automática
            horasFalta: totalFaltas
          });

          // Salva o item da folha
          const itemData: any = {
            folha_id: folhaId,
            colaborador_id: colab.id,
            salario_base: colab.salario_base,
            total_proventos: res.proventos,
            total_descontos: res.descontos,
            total_liquido: res.liquido,
            inss_mes: res.inss,
            irrf_mes: res.irrf,
            fgts_mes: res.fgts,
            detalhes: res as any
          };

          await (supabase as any)
            .from('folha_itens')
            .upsert(itemData);

          // Auditoria analítica
          await (supabase as any).from('folha_auditoria').insert({
            folha_id: folhaId,
            colaborador_id: colab.id,
            tipo_evento: 'calculo_mensal',
            mensagem: `Cálculo analítico processado para ${colab.nome_completo}. Eventos: ${res.detalheEventos?.length || 0}`,
            severidade: 'info',
            detalhes: { 
              timestamp: new Date().toISOString(), 
              liquido: res.liquido,
              eventos: res.detalheEventos 
            }
          });

          progress.success++;
          // Notifica progresso em tempo real
          onProgress?.({ ...progress });
        } catch (err: any) {
          console.error(`Erro no colaborador ${colab.nome_completo}:`, err);
          
          // Registrar erro analítico na auditoria
          await (supabase as any).from('folha_auditoria').insert({
            folha_id: folhaId,
            colaborador_id: colab.id,
            tipo_evento: 'calculo_mensal',
            mensagem: `Erro ao processar ${colab.nome_completo}: ${err.message}`,
            severidade: 'erro',
            detalhes: { error: err.message, stack: err.stack }
          });

          progress.errors++;
          onProgress?.({ ...progress });
        }
        
        progress.current++;
      }

      // 4. Registrar evento global de cálculo em lote
      await (supabase as any).from('folha_auditoria').insert({
        folha_id: folhaId,
        tipo_evento: 'calculo_mensal',
        mensagem: `Processamento em lote finalizado para ${progress.total} colaboradores.`,
        severidade: 'info',
        detalhes: { progress, competencia }
      });

      return progress;
    } catch (error: any) {
      toast.error(`Falha no processamento em lote: ${error.message}`);
      throw error;
    }
  }
};
