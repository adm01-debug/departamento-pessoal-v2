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
      const { data, error } = await supabase
        .from('folhas_pagamento')
        .upsert({
          empresa_id: empresaId,
          colaborador_id: colaboradorId,
          competencia,
          total_proventos: res.proventos,
          total_descontos: res.descontos,
          salario_liquido: res.liquido,
          inss: res.inss,
          irrf: res.irrf,
          fgts: res.fgts,
          status: 'rascunho',
          updated_at: new Date().toISOString()
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
