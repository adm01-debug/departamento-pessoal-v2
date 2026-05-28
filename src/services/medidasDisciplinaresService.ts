import { supabase } from '@/integrations/supabase/client';
export const medidasDisciplinaresService = {
  async listar(empresaId?: string): Promise<any[]> {
    
    let q = (supabase as Record<string, unknown>).from('medidas_disciplinares').select('*, colaborador:colaboradores(nome_completo)').order('data_ocorrencia', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },
  
  async buscarPorColaborador(colaboradorId: string): Promise<any[]> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('medidas_disciplinares').select('*').eq('colaborador_id', colaboradorId).order('data_ocorrencia', { ascending: false });
    if (error) throw error;
    return data || [];
  
  },
  
  async criar(d: any): Promise<unknown> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('medidas_disciplinares').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de medida disciplinar foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<unknown> {
    
    const { data, error } = await (supabase as Record<string, unknown>).from('medidas_disciplinares').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de medida disciplinar foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await (supabase as Record<string, unknown>).from('medidas_disciplinares').delete().eq('id', id);
    if (error) throw error;
  
  },
};

