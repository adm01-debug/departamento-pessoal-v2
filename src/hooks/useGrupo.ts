/**
 * @fileoverview Hook de contexto de GRUPO empresarial.
 *
 * Holding única com várias CNPJs. Expõe lista completa de empresas no
 * escopo do usuário (via RLS / get_user_scope_empresas) e helpers
 * agregados (cor, regime, ordem) usados por dashboards consolidados.
 *
 * Performance: agrega em maps Record<id, X> para O(1) lookup nas telas
 * (evita re-find linear em listas longas).
 *
 * @module hooks/useGrupo
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  getRegimeInfo,
  type RegimeTributario,
  type RegimeInfo,
} from '@/constants/regimes';

export interface EmpresaGrupo {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string | null;
  ativa: boolean;
  regime_tributario: RegimeTributario;
  aliquota_simples: number | null;
  fap: number | null;
  rat: number | null;
  terceiros: number | null;
  cor_identificacao: string | null;
  ordem_exibicao: number | null;
}

export interface UseGrupoReturn {
  empresas: EmpresaGrupo[];
  empresasIds: string[];
  empresasAtivas: EmpresaGrupo[];
  coresPorEmpresa: Record<string, string>;
  regimePorEmpresa: Record<string, RegimeInfo>;
  nomesPorEmpresa: Record<string, string>;
  totalEmpresas: number;
  totalAtivas: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const EMPTY: EmpresaGrupo[] = [];

export function useGrupo(): UseGrupoReturn {
  const { data, isLoading, isError, error } = useQuery<EmpresaGrupo[]>({
    queryKey: ['grupo-empresas-escopo'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      // RLS já restringe aos vínculos do usuário (admins veem tudo via user_empresas).
      const { data, error } = await supabase
        .from('empresas')
        .select(
          'id, razao_social, nome_fantasia, cnpj, ativa, regime_tributario, aliquota_simples, fap, rat, terceiros, cor_identificacao, ordem_exibicao',
        )
        .order('ordem_exibicao', { ascending: true, nullsFirst: false })
        .order('razao_social', { ascending: true });

      if (error) {
        // Sem permissão (RLS) ou erro de schema durante migração — degradar sem quebrar UI.
        if (error.code === '42501' || error.code === '42703') return EMPTY;
        throw error;
      }
      return (data ?? []) as EmpresaGrupo[];
    },
  });

  const empresas = data ?? EMPTY;

  const derived = useMemo(() => {
    const empresasAtivas: EmpresaGrupo[] = [];
    const coresPorEmpresa: Record<string, string> = {};
    const regimePorEmpresa: Record<string, RegimeInfo> = {};
    const nomesPorEmpresa: Record<string, string> = {};
    const empresasIds: string[] = [];

    for (const e of empresas) {
      empresasIds.push(e.id);
      if (e.ativa) empresasAtivas.push(e);
      const info = getRegimeInfo(e.regime_tributario);
      regimePorEmpresa[e.id] = info;
      coresPorEmpresa[e.id] = e.cor_identificacao ?? info.cor;
      nomesPorEmpresa[e.id] = e.nome_fantasia ?? e.razao_social;
    }

    return {
      empresasIds,
      empresasAtivas,
      coresPorEmpresa,
      regimePorEmpresa,
      nomesPorEmpresa,
    };
  }, [empresas]);

  return {
    empresas,
    ...derived,
    totalEmpresas: empresas.length,
    totalAtivas: derived.empresasAtivas.length,
    isLoading,
    isError,
    error: (error as Error | null) ?? null,
  };
}
