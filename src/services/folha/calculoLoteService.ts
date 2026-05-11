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
      const { data: colaboradores, error: colabError } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('status', 'ativo');

      if (colabError) throw colabError;
      if (!colaboradores || colaboradores.length === 0) {
        throw new Error('Nenhum colaborador ativo encontrado para esta empresa.');
      }

      // 2. Garantir cabeçalho da folha
      let { data: header, error: headerError } = await supabase
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
        const { data: newHeader, error: createError } = await supabase
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

      // 3. Processar cada colaborador (em série para evitar sobrecarga de conexões e permitir acompanhamento)
      for (const colab of colaboradores) {
        try {
          // Busca lançamentos/rubricas variáveis do mês para este colaborador
          const { data: lancamentos } = await supabase
            .from('lancamentos_folha')
            .select('*')
            .eq('colaborador_id', colab.id)
            .eq('competencia', competencia);

          // Soma adicionais e descontos dos lançamentos
          const adicionais = lancamentos?.filter(l => l.tipo === 'provento').reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;
          const descontosExtras = lancamentos?.filter(l => l.tipo === 'desconto').reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;

          // Executa o motor de cálculo
          const res = folhaCalc.processar(Number(colab.salario_base || 0), {
            adicionais,
            descontosExtras,
            dependentes: 0 // TODO: Buscar dependentes reais
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

          await supabase
            .from('folha_itens')
            .upsert(itemData);

          // Auditoria
          await supabase.from('folha_auditoria').insert({
            folha_id: folhaId,
            colaborador_id: colab.id,
            tipo_evento: 'calculo_mensal',
            mensagem: `Cálculo de folha processado em lote para ${colab.nome_completo}`,
            severidade: 'info',
            detalhes: { timestamp: new Date().toISOString() } as any
          });

          progress.success++;
        } catch (err) {
          console.error(`Erro no colaborador ${colab.nome_completo}:`, err);
          progress.errors++;
        }
        
        progress.current++;
        onProgress?.({ ...progress });
      }

      return progress;
    } catch (error: any) {
      toast.error(`Falha no processamento em lote: ${error.message}`);
      throw error;
    }
  }
};
