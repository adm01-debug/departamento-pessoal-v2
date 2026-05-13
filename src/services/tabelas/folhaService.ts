import { supabase } from '@/integrations/supabase/client';

export const esocialLotesService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('esocial_lotes').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('esocial_lotes').insert(d);
    if (error) throw error;
  },
};

export const eventosVariaveisService = {
  listar: async (empresaId?: string, competencia?: string) => {
    let q = supabase.from('eventos_variaveis').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    if (competencia) q = q.eq('competencia', competencia);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('eventos_variaveis').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('eventos_variaveis').delete().eq('id', id);
    if (error) throw error;
  },
};

export const lancamentosFolhaService = {
  listar: async (folhaId: string) => {
    const { data, error } = await supabase.from('lancamentos_folha').select('*').eq('folha_id', folhaId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('lancamentos_folha').insert(d);
    if (error) throw error;
  },
};

export const rubricasFolhaService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('rubricas_folha').select('*').order('codigo');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('rubricas_folha').insert(d);
    if (error) throw error;
  },
  atualizar: async (id: string, d: any) => {
    const { error } = await supabase.from('rubricas_folha').update(d).eq('id', id);
    if (error) throw error;
  },
};

export const parametrosFiscaisService = {
  listar: async () => {
    const { data, error } = await supabase.from('parametros_fiscais').select('*').order('vigencia_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('parametros_fiscais').insert(d);
    if (error) throw error;
  },
};
