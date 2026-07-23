import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';

export interface ContratoAssinaturaKPI {
  empresa_id: string;
  tokens_gerados: number;
  tokens_assinados: number;
  tokens_pendentes: number;
  tokens_expirados: number;
  taxa_conversao_pct: number | null;
  tempo_medio_assinatura_h: number | null;
}

export interface ContratoTokenPendente {
  id: string;
  empresa_id: string;
  contrato_id: string;
  email_destinatario: string | null;
  expira_em: string;
  created_at: string;
  reminders_enviados: number;
  ultimo_reminder_at: string | null;
  dias_desde_geracao: number;
  dias_para_expirar: number;
  contrato_status: string;
  data_inicio: string | null;
  data_fim: string | null;
  colaborador_id: string | null;
  colaborador_nome: string | null;
  tipo_contrato: string | null;
}

export function useContratosAssinaturaKPI() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const kpi = useQuery({
    queryKey: ['contratos-assinatura-kpi', empresaId],
    queryFn: async (): Promise<ContratoAssinaturaKPI | null> => {
      if (!empresaId) return null;
      const { data, error } = await supabase
        .from('v_contratos_assinatura_kpi' as never)
        .select('*')
        .eq('empresa_id', empresaId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as ContratoAssinaturaKPI | null;
    },
    enabled: !!empresaId,
    staleTime: 60_000,
  });

  const pendentes = useQuery({
    queryKey: ['contratos-tokens-pendentes', empresaId],
    queryFn: async (): Promise<ContratoTokenPendente[]> => {
      if (!empresaId) return [];
      const { data, error } = await supabase
        .from('v_contratos_tokens_pendentes' as never)
        .select('*')
        .eq('empresa_id', empresaId)
        .order('expira_em', { ascending: true })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as ContratoTokenPendente[];
    },
    enabled: !!empresaId,
    staleTime: 60_000,
  });

  return { kpi, pendentes };
}
