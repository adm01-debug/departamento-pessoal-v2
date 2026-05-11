import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { folhaCalc, CalculoResultado } from '@/utils/folhaCalc';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCalculoFolha() {
  const [resultado, setResultado] = useState<CalculoResultado | null>(null);
  const [isCalculando, setIsCalculando] = useState(false);
  const queryClient = useQueryClient();

  const calcularEGuardar = useMutation({
    mutationFn: async ({ 
      colaboradorId, 
      empresaId, 
      competencia, 
      salarioBase,
      params 
    }: { 
      colaboradorId: string; 
      empresaId: string; 
      competencia: string;
      salarioBase: number;
      params?: any;
    }) => {
      setIsCalculando(true);
      
      // Realiza o cálculo
      const res = folhaCalc.processar(salarioBase, params);
      setResultado(res);

      // Persiste no banco de dados
      // 1. Garantir que existe o cabeçalho da folha para a competência
      const { data: header, error: headerError } = await supabase
        .from('folhas_pagamento')
        .select('id')
        .eq('empresa_id', empresaId)
        .eq('competencia', competencia)
        .maybeSingle();

      if (headerError) throw headerError;

      let folhaId = header?.id;

      if (!folhaId) {
        const { data: newHeader, error: createError } = await supabase
          .from('folhas_pagamento')
          .insert({
            empresa_id: empresaId,
            competencia,
            status: 'rascunho',
            tipo: 'Mensal'
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        folhaId = newHeader.id;
      }

      // 2. Persiste o item individual (resultado do cálculo)
      const { data, error } = await supabase
        .from('folha_itens')
        .upsert({
          folha_id: folhaId,
          colaborador_id: colaboradorId,
          salario_base: salarioBase,
          total_proventos: res.proventos,
          total_descontos: res.descontos,
          total_liquido: res.liquido,
          inss_mes: res.inss,
          irrf_mes: res.irrf,
          fgts_mes: res.fgts,
          detalhes: res as any
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      toast.success('Cálculo realizado e salvo com sucesso.');
    },
    onError: (error: any) => {
      toast.error(`Erro ao calcular: ${error.message}`);
    },
    onSettled: () => setIsCalculando(false)
  });

  return {
    resultado,
    isCalculando: isCalculando || calcularEGuardar.isPending,
    executarCalculo: calcularEGuardar.mutateAsync,
  };
}
