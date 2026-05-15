import { supabase } from '@/integrations/supabase/client';
import { folhaCalc } from '@/utils/folhaCalc';
import { toast } from 'sonner';
import { pontoIntegracaoUtils } from '@/utils/folha/pontoIntegracaoUtils';

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
      const [ano, mes] = competencia.split('-');
      const dataInicio = `${ano}-${mes}-01`;
      const dataFim = `${ano}-${mes}-31`; // Simplificado para busca

      // 1. Buscar colaboradores ativos da empresa
      const { data: colaboradores, error: colabError } = await (supabase as any)
        .from('colaboradores')
        .select(`
          *,
          dependentes (id, tipo),
          eventos_variaveis (codigo, descricao, tipo, valor),
          contratos:contratos_trabalho(jornada_mensal, tipo_contrato)
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
          const jornada = colab.contratos?.[0]?.jornada_mensal || 220;

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

          // 3.2 Buscar Benefícios Ativos (Vale Transporte / Vale Alimentação / Refeição)
          const { data: beneficiosVinculos } = await (supabase as any)
            .from('colaborador_beneficios')
            .select(`
              *,
              beneficio:beneficios(*)
            `)
            .eq('colaborador_id', colab.id)
            .eq('status', 'ativo');

          const beneficiosEventos: any[] = [];
          if (beneficiosVinculos) {
            beneficiosVinculos.forEach((v: any) => {
              if (v.beneficio) {
                // Cálculo de desconto de VT (6% sobre salário base limitado ao custo do benefício)
                if (v.beneficio.tipo === 'VT') {
                  const custoVT = Number(v.valor_colaborador || 0);
                  const descontoMaximoVT = Number(colab.salario_base || 0) * 0.06;
                  const valorDescontoVT = Math.min(custoVT, descontoMaximoVT);
                  
                  if (valorDescontoVT > 0) {
                    beneficiosEventos.push({
                      codigo: '5010',
                      descricao: 'Desconto Vale Transporte (Portaria 671)',
                      tipo: 'desconto',
                      valor: Math.round(valorDescontoVT * 100) / 100
                    });
                  }
                }
                
                // Outros descontos de benefícios (PAT, etc.)
                if (v.valor_colaborador && v.beneficio.tipo !== 'VT') {
                   beneficiosEventos.push({
                      codigo: '5020',
                      descricao: `Coparticipação ${v.beneficio.nome}`,
                      tipo: 'desconto',
                      valor: Number(v.valor_colaborador)
                   });
                }
              }
            });
          }

          const res = folhaCalc.processar(Number(colab.salario_base || 0), {
            dependentes: dependentesCount,
            eventos: [...eventosVariaveis, ...beneficiosEventos],
            horasExtras50: totalHE,
            horasFalta: totalFaltas,
            jornada
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
            .upsert(itemData, { onConflict: 'folha_id,colaborador_id' });

          // Auditoria analítica
          await (supabase as any).from('folha_auditoria').insert({
            folha_id: folhaId,
            colaborador_id: colab.id,
            tipo_evento: 'CALCULO',
            mensagem: `Cálculo analítico processado para ${colab.nome_completo}. Eventos: ${res.detalheEventos?.length || 0}. Integração Ponto: ${res.horasExtras?.toFixed(1)}h extras.`,
            severidade: 'INFO',
            detalhes: { 
              timestamp: new Date().toISOString(), 
              liquido: res.liquido,
              compliance: 'Portaria 671 MTP'
            }
          });

          progress.success++;
          onProgress?.({ ...progress });
        } catch (err: any) {
          console.error(`Erro no colaborador ${colab.nome_completo}:`, err);
          progress.errors++;
          onProgress?.({ ...progress });
        }
        
        progress.current++;
      }

      return progress;
    } catch (error: any) {
      toast.error(`Falha no processamento em lote: ${error.message}`);
      throw error;
    }
  }
};