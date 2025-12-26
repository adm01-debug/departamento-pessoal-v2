/**
 * @fileoverview Service para gerenciamento de admissões
 * @module services/admissoesService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Admissao, AdmissaoFormData } from '@/types/admissao';

export const admissoesService = {
  async listar(): Promise<Admissao[]> {
    const { data, error } = await supabase.from('admissoes').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async buscarPorId(id: string): Promise<Admissao | null> {
    const { data, error } = await supabase.from('admissoes').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async criar(dados: AdmissaoFormData): Promise<Admissao> {
    const { data, error } = await supabase.from('admissoes').insert(dados).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async atualizar(id: string, dados: Partial<AdmissaoFormData>): Promise<Admissao> {
    const { data, error } = await supabase.from('admissoes').update(dados).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('admissoes').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async atualizarStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase.from('admissoes').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
  },
};
