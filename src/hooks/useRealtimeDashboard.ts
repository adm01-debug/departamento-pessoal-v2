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
    // Realtime desativado temporariamente para compatibilidade com banco externo via bridge
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, [queryClient]);
}
