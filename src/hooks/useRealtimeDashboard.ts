import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TABLE_LABELS: Record<string, string> = {
  admissoes: '📋 Nova admissão registrada',
  desligamentos: '👋 Novo desligamento registrado',
  ferias: '🏖️ Atualização de férias',
  afastamentos: '🏥 Atualização de afastamento',
  notificacoes: '🔔 Nova notificação',
  colaboradores: '👤 Atualização de colaborador',
  registros_ponto: '⏰ Novo registro de ponto',
  comunicados: '📢 Novo comunicado',
  folhas_pagamento: '💰 Folha atualizada',
  beneficios: '🎁 Benefício atualizado',
};

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissoes' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
        queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        queryClient.invalidateQueries({ queryKey: ['executive-kpis'] });
        toast.info(TABLE_LABELS.admissoes);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'desligamentos' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        queryClient.invalidateQueries({ queryKey: ['executive-kpis'] });
        toast.info(TABLE_LABELS.desligamentos);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ferias' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
        queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        queryClient.invalidateQueries({ queryKey: ['executive-kpis'] });
        toast.info(TABLE_LABELS.ferias);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'afastamentos' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-pendencias'] });
        queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        toast.info(TABLE_LABELS.afastamentos);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
        queryClient.invalidateQueries({ queryKey: ['notificacoes-db'] });
        queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
        const nova = payload.new as any;
        if (nova?.titulo && payload.eventType === 'INSERT') {
          toast.info(`🔔 ${nova.titulo}`, { description: nova.mensagem?.slice(0, 60) });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colaboradores' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['vw-cadastro-incompleto'] });
        queryClient.invalidateQueries({ queryKey: ['executive-kpis'] });
        toast.info(TABLE_LABELS.colaboradores);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registros_ponto' }, () => {
        queryClient.invalidateQueries({ queryKey: ['morning-briefing'] });
        queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comunicados' }, () => {
        queryClient.invalidateQueries({ queryKey: ['comunicados'] });
        queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'folhas_pagamento' }, () => {
        queryClient.invalidateQueries({ queryKey: ['executive-kpis'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beneficios' }, () => {
        queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
