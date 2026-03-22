import { supabase } from '@/integrations/supabase/client';

export const desligamentoService = {
  async listar(empresaId?: string) {
    let query = supabase
      .from('desligamentos')
      .select('*, colaborador:colaboradores(nome_completo)')
      .order('data_desligamento', { ascending: false })
      .limit(500);
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async buscarPorId(id: string) {
    if (!id) throw new Error('ID é obrigatório');
    const { data, error } = await supabase.from('desligamentos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async criar(d: any) {
    // Input validation
    if (!d.colaborador_id) throw new Error('Colaborador é obrigatório');
    if (!d.data_desligamento) throw new Error('Data de desligamento é obrigatória');
    if (!d.tipo) throw new Error('Tipo de rescisão é obrigatório');
    if (!d.empresa_id) throw new Error('Empresa é obrigatória');

    // Sanitize text fields
    const sanitized = {
      ...d,
      motivo: d.motivo?.trim().slice(0, 1000) || null,
    };

    const { data, error } = await supabase.from('desligamentos').insert(sanitized).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async atualizar(id: string, d: any) {
    if (!id) throw new Error('ID é obrigatório');
    const { data, error } = await supabase.from('desligamentos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async excluir(id: string) {
    if (!id) throw new Error('ID é obrigatório');
    const { error } = await supabase.from('desligamentos').delete().eq('id', id);
    if (error) throw error;
  },
};
