import { supabase } from '@/integrations/supabase/client';

export const documentoTemplatesService = {
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
};

export const documentosAdmissaoService = {
  listar: async (admissaoId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('admissao_id', admissaoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
};

export const documentosAfastamentoService = {
  listar: async (afastamentoId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('afastamento_id', afastamentoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
};

export const documentosAssinaturaService = {
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
};

export const documentosColaboradorService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('colaborador_id', colaboradorId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
};
