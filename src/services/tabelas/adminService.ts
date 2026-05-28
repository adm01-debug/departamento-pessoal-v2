import { supabase } from '@/integrations/supabase/client';

export const logEnvioRelatoriosService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('').select('*').order('created_at', { ascending: false }).limit(100);
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
};

export const relatoriosAgendadosService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('').delete().eq('id', id);
    if (error) throw error;
  },
};

export const savedFiltersService = {
  listar: async (userId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('').delete().eq('id', id);
    if (error) throw error;
  },
};

export const bitrix24Service = {
  getConfig: async () => {
    const { data, error } = await supabase.from('').select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
  saveConfig: async (d: any) => {
    const { error } = await supabase.from('').upsert(d);
    if (error) throw error;
  },
  getLogs: async () => {
    const { data, error } = await supabase.from('').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  },
};
