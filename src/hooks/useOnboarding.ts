/**
 * @fileoverview Hook para gerenciamento de onboarding
 * @module hooks/useOnboarding
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStep {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  obrigatorio: boolean;
  concluido: boolean;
}

export function useOnboarding(admissaoId?: string) {
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ['onboarding', admissaoId],
    queryFn: async () => {
      if (!admissaoId) return [];
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('admissao_id', admissaoId)
        .order('ordem');
      if (error) throw error;
      return data as OnboardingStep[];
    },
    enabled: !!admissaoId,
  });

  const progresso = steps.length ? (steps.filter(s => s.concluido).length / steps.length) * 100 : 0;

  return { steps, isLoading, progresso };
}

export default useOnboarding;
