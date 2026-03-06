// @ts-nocheck
/**
 * @fileoverview Service para onboarding de colaboradores
 * @module services/onboardingService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Onboarding, TemplateOnboarding } from '@/types/onboarding';

export const onboardingService = {
  async listar(): Promise<Onboarding[]> {
    const { data, error } = await supabase.from('onboardings').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async buscarPorColaborador(colaboradorId: string): Promise<Onboarding | null> {
    const { data, error } = await supabase.from('onboardings').select('*').eq('colaborador_id', colaboradorId).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async criar(dados: Partial<Onboarding>): Promise<Onboarding> {
    const { data, error } = await supabase.from('onboardings').insert(dados).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async concluirEtapa(onboardingId: string, etapaId: string): Promise<void> {
    const { error } = await supabase.rpc('concluir_etapa_onboarding', { onboarding_id: onboardingId, etapa_id: etapaId });
    if (error) throw new Error(error.message);
  },

  async listarTemplates(): Promise<TemplateOnboarding[]> {
    const { data, error } = await supabase.from('templates_onboarding').select('*').eq('ativo', true);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async criarTemplate(template: Partial<TemplateOnboarding>): Promise<TemplateOnboarding> {
    const { data, error } = await supabase.from('templates_onboarding').insert(template).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
};
