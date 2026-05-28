import { supabase } from '@/integrations/supabase/client';

export const beneficiariosPlanoService = {
  listar: async (planoId: string) => {
    const { data, error } = await supabase.from('beneficiarios_plano').select('*, colaborador:colaboradores(nome_completo)').eq('plano_saude_id', planoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('beneficiarios_plano').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('beneficiarios_plano').update({ status: 'excluido', data_exclusao: new Date().toISOString().split('T')[0] }).eq('id', id);
    if (error) throw error;
  },
};

export const beneficiariosSeguroService = {
  listar: async (seguroId: string) => {
    const { data, error } = await supabase.from('beneficiarios_seguro').select('*, colaborador:colaboradores(nome_completo)').eq('seguro_vida_id', seguroId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('beneficiarios_seguro').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('beneficiarios_seguro').update({ status: 'inativo' }).eq('id', id);
    if (error) throw error;
  },
};

export const colaboradorBeneficiosService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('colaborador_id', colaboradorId);
    if (error) throw error;
    return data || [];
  },
};

export const segurosColaboradoresService = {
  listar: async (seguroId?: string) => {
    let q = supabase.from('').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (seguroId) q = q.eq('seguro_vida_id', seguroId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  vincular: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
  desvincular: async (id: string) => {
    const { error } = await supabase.from('').delete().eq('id', id);
    if (error) throw error;
  },
};
