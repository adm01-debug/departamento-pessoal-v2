import { supabase } from '@/integrations/supabase/client';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado.`);
  return data;
};

export const contratoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('contratos').select('*, colaborador:colaboradores(nome_completo)').order('data_inicio', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('contratos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async buscarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('contratos').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('contratos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'contrato');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('contratos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'contrato');
  },
  async encerrar(id: string, motivo: string) {
    return contratoService.atualizar(id, { status: 'encerrado', observacoes: motivo });
  },
  async renovar(id: string, novaDataFim: string) {
    return contratoService.atualizar(id, { data_fim: novaDataFim, status: 'ativo' });
  },
};
