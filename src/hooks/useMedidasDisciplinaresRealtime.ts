import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Realtime auto-refresh para o workflow de medidas disciplinares.
 * Escuta mudanças em `medidas_disciplinares`, `medidas_disciplinares_workflow_log`
 * e `medidas_disciplinares_integracao` filtradas por empresa e invalida as
 * queries relevantes para atualização imediata do Kanban, KPIs e cards.
 */
export function useMedidasDisciplinaresRealtime(empresaId?: string) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!empresaId) return;

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['medidas-disciplinares'] });
      qc.invalidateQueries({ queryKey: ['medidas-kanban'] });
      qc.invalidateQueries({ queryKey: ['medida-integracao'] });
      qc.invalidateQueries({ queryKey: ['medida-esocial'] });
      qc.invalidateQueries({ queryKey: ['medida-workflow-timeline'] });
    };

    const filter = `empresa_id=eq.${empresaId}`;
    const channel = supabase
      .channel(`medidas-disciplinares-rt-${empresaId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medidas_disciplinares', filter },
        invalidate,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medidas_disciplinares_workflow_log', filter },
        invalidate,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medidas_disciplinares_integracao', filter },
        invalidate,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [empresaId, qc]);
}
