/**
 * Hook para gerenciamento de Folha de Pagamento
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FolhaPagamento {
  id: string;
  competencia: string;
  colaborador_id: string;
  colaborador?: { id: string; nome: string; cpf: string };
  salario_base: number;
  horas_extras: number;
  adicional_noturno: number;
  comissoes: number;
  gratificacoes: number;
  insalubridade: number;
  periculosidade: number;
  dsr: number;
  total_proventos: number;
  inss: number;
  irrf: number;
  vale_transporte: number;
  vale_alimentacao: number;
  plano_saude: number;
  pensao_alimenticia: number;
  outros_descontos: number;
  total_descontos: number;
  salario_liquido: number;
  fgts: number;
  status: 'rascunho' | 'calculada' | 'aprovada' | 'paga' | 'cancelada';
  created_at: string;
}

export interface ResumoFolha {
  totalColaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
  totalFGTS: number;
  totalINSS: number;
  totalIRRF: number;
}

export interface UseFolhaPagamentoReturn {
  folhas: FolhaPagamento[];
  loading: boolean;
  error: string | null;
  resumo: ResumoFolha;
  buscarPorCompetencia: (competencia: string) => Promise<FolhaPagamento[]>;
  buscarPorColaborador: (colaboradorId: string) => Promise<FolhaPagamento[]>;
  calcular: (competencia: string, colaboradorId?: string) => Promise<void>;
  aprovar: (id: string) => Promise<void>;
  reprovar: (id: string, motivo: string) => Promise<void>;
  marcarPaga: (id: string) => Promise<void>;
  recarregar: () => Promise<void>;
  competenciaAtual: string;
  setCompetencia: (competencia: string) => void;
}

export function useFolhaPagamento(competenciaInicial?: string): UseFolhaPagamentoReturn {
  const { toast } = useToast();
  const [folhas, setFolhas] = useState<FolhaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competenciaAtual, setCompetencia] = useState(
    competenciaInicial || new Date().toISOString().slice(0, 7)
  );

  const carregarFolhas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('folhas_pagamento')
        .select('*, colaborador:colaboradores(id, nome, cpf)')
        .eq('competencia', competenciaAtual)
        .order('colaborador(nome)');

      if (queryError) throw queryError;
      setFolhas(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar folhas';
      setError(message);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [competenciaAtual, toast]);

  useEffect(() => {
    carregarFolhas();
  }, [carregarFolhas]);

  const buscarPorCompetencia = useCallback(async (competencia: string): Promise<FolhaPagamento[]> => {
    const { data, error: queryError } = await supabase
      .from('folhas_pagamento')
      .select('*, colaborador:colaboradores(id, nome, cpf)')
      .eq('competencia', competencia);

    if (queryError) throw queryError;
    return data || [];
  }, []);

  const buscarPorColaborador = useCallback(async (colaboradorId: string): Promise<FolhaPagamento[]> => {
    const { data, error: queryError } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('competencia', { ascending: false });

    if (queryError) throw queryError;
    return data || [];
  }, []);

  const calcular = useCallback(async (competencia: string, colaboradorId?: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Buscar colaboradores
      let query = supabase.from('colaboradores').select('*').eq('status', 'ativo');
      if (colaboradorId) query = query.eq('id', colaboradorId);
      
      const { data: colaboradores, error: colabError } = await query;
      if (colabError) throw colabError;

      // Calcular folha para cada colaborador
      for (const colab of colaboradores || []) {
        // Verificar se já existe
        const { data: existente } = await supabase
          .from('folhas_pagamento')
          .select('id')
          .eq('competencia', competencia)
          .eq('colaborador_id', colab.id)
          .single();

        // Cálculos básicos (simplificado)
        const totalProventos = colab.salario || 0;
        const inss = Math.min(totalProventos * 0.14, 908.85);
        const baseIRRF = totalProventos - inss;
        const irrf = baseIRRF > 2259.20 ? (baseIRRF * 0.075 - 169.44) : 0;
        const totalDescontos = inss + Math.max(0, irrf);
        const salarioLiquido = totalProventos - totalDescontos;
        const fgts = totalProventos * 0.08;

        const dadosFolha = {
          competencia,
          colaborador_id: colab.id,
          salario_base: colab.salario || 0,
          horas_extras: 0,
          adicional_noturno: 0,
          comissoes: 0,
          gratificacoes: 0,
          insalubridade: 0,
          periculosidade: 0,
          dsr: 0,
          total_proventos: totalProventos,
          inss,
          irrf: Math.max(0, irrf),
          vale_transporte: 0,
          vale_alimentacao: 0,
          plano_saude: 0,
          pensao_alimenticia: 0,
          outros_descontos: 0,
          total_descontos: totalDescontos,
          salario_liquido: salarioLiquido,
          fgts,
          status: 'calculada' as const
        };

        if (existente) {
          await supabase.from('folhas_pagamento').update(dadosFolha).eq('id', existente.id);
        } else {
          await supabase.from('folhas_pagamento').insert([dadosFolha]);
        }
      }

      toast({ title: 'Sucesso', description: 'Folha calculada com sucesso' });
      await carregarFolhas();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao calcular folha';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, carregarFolhas]);

  const aprovar = useCallback(async (id: string): Promise<void> => {
    await supabase.from('folhas_pagamento').update({ status: 'aprovada' }).eq('id', id);
    toast({ title: 'Sucesso', description: 'Folha aprovada' });
    await carregarFolhas();
  }, [toast, carregarFolhas]);

  const reprovar = useCallback(async (id: string, motivo: string): Promise<void> => {
    await supabase.from('folhas_pagamento').update({ status: 'rascunho' }).eq('id', id);
    toast({ title: 'Folha reprovada', description: motivo });
    await carregarFolhas();
  }, [toast, carregarFolhas]);

  const marcarPaga = useCallback(async (id: string): Promise<void> => {
    await supabase.from('folhas_pagamento').update({ status: 'paga' }).eq('id', id);
    toast({ title: 'Sucesso', description: 'Folha marcada como paga' });
    await carregarFolhas();
  }, [toast, carregarFolhas]);

  const resumo = useMemo((): ResumoFolha => {
    return {
      totalColaboradores: folhas.length,
      totalProventos: folhas.reduce((s, f) => s + f.total_proventos, 0),
      totalDescontos: folhas.reduce((s, f) => s + f.total_descontos, 0),
      totalLiquido: folhas.reduce((s, f) => s + f.salario_liquido, 0),
      totalFGTS: folhas.reduce((s, f) => s + f.fgts, 0),
      totalINSS: folhas.reduce((s, f) => s + f.inss, 0),
      totalIRRF: folhas.reduce((s, f) => s + f.irrf, 0)
    };
  }, [folhas]);

  return {
    folhas,
    loading,
    error,
    resumo,
    buscarPorCompetencia,
    buscarPorColaborador,
    calcular,
    aprovar,
    reprovar,
    marcarPaga,
    recarregar: carregarFolhas,
    competenciaAtual,
    setCompetencia
  };
}

export default useFolhaPagamento;
