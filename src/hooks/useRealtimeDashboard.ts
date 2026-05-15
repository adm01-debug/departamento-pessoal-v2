import { useEffect, useRef } from 'react';
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
  batidas_ponto: '⏰ Novo registro de ponto',
  comunicados: '📢 Novo comunicado',
  folhas_pagamento: '💰 Folha atualizada',
  beneficios: '🎁 Benefício atualizado',
  metas_okrs: '🎯 Meta / OKR atualizada',
  feedbacks_360: '📈 Novo feedback registrado',
  inscricoes_cursos: '🎓 Nova inscrição em curso',
  treinamentos: '📚 Treinamento atualizado',
};

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const debounceInvalidate = (keys: string[][], delay = 2000) => {
    const keyString = JSON.stringify(keys);
    if (timeouts.current[keyString]) {
      clearTimeout(timeouts.current[keyString]);
    }
    timeouts.current[keyString] = setTimeout(() => {
      keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      delete timeouts.current[keyString];
    }, delay);
  };

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissoes' }, () => {
        debounceInvalidate([['dashboard-stats'], ['dashboard-pendencias'], ['morning-briefing'], ['executive-kpis']]);
        toast.info(TABLE_LABELS.admissoes);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'desligamentos' }, () => {
        debounceInvalidate([['dashboard-stats'], ['morning-briefing'], ['executive-kpis']]);
        toast.info(TABLE_LABELS.desligamentos);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ferias' }, () => {
        debounceInvalidate([['dashboard-stats'], ['dashboard-pendencias'], ['morning-briefing'], ['executive-kpis']]);
        toast.info(TABLE_LABELS.ferias);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'afastamentos' }, () => {
        debounceInvalidate([['dashboard-pendencias'], ['morning-briefing']]);
        toast.info(TABLE_LABELS.afastamentos);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, (payload) => {
        debounceInvalidate([['notificacoes'], ['notificacoes-db'], ['portal-completo']]);
        const nova = payload.new as any;
        if (nova?.titulo && payload.eventType === 'INSERT') {
          toast.info(`🔔 ${nova.titulo}`, { description: (nova.mensagem as string)?.slice(0, 60) });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colaboradores' }, () => {
        debounceInvalidate([['dashboard-stats'], ['vw-cadastro-incompleto'], ['executive-kpis']]);
        toast.info(TABLE_LABELS.colaboradores);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'batidas_ponto' }, () => {
        debounceInvalidate([['morning-briefing'], ['portal-completo']]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comunicados' }, () => {
        debounceInvalidate([['comunicados'], ['portal-completo']]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'folhas_pagamento' }, () => {
        debounceInvalidate([['executive-kpis'], ['dashboard-stats'], ['portal-completo']]);
      })
      .subscribe();

    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
