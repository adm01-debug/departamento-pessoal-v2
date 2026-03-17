import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const REALTIME_TABLES = [
  'admissoes',
  'desligamentos',
  'ferias',
  'afastamentos',
  'notificacoes',
  'colaboradores',
  'registros_ponto',
] as const;

const TABLE_LABELS: Record<string, string> = {
  admissoes: '📋 Nova admissão registrada',
  desligamentos: '👋 Novo desligamento registrado',
  ferias: '🏖️ Atualização de férias',
  afastamentos: '🏥 Atualização de afastamento',
  notificacoes: '🔔 Nova notificação',
  colaboradores: '👤 Atualização de colaborador',
  registros_ponto: '⏰ Novo registro de ponto',
};

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissoes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
          queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
          toast.info(TABLE_LABELS.admissoes);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'desligamentos' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
          toast.info(TABLE_LABELS.desligamentos);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ferias' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
          queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
          toast.info(TABLE_LABELS.ferias);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'afastamentos' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
          queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
          toast.info(TABLE_LABELS.afastamentos);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notificacoes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'colaboradores' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['vw-cadastro-incompleto'] });
          toast.info(TABLE_LABELS.colaboradores);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registros_ponto' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
