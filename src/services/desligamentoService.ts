import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';
export const desligamentoService = {
  async listar(empresaId?: string): Promise<any[]> {
    
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
  
  async buscarPorId(id: string): Promise<any | null> {
    if (!id) throw new Error('ID é obrigatório');
    
    
    const { data, error } = await supabase.from('desligamentos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  
  },
  
  async criar(d: any): Promise<any> {
    try {
      if (!d.colaborador_id) throw new Error('Colaborador é obrigatório');
      if (!d.data_desligamento) throw new Error('Data de desligamento é obrigatória');
      if (!d.tipo) throw new Error('Tipo de rescisão é obrigatório');
      if (!d.empresa_id) throw new Error('Empresa é obrigatória');

      const sanitized = {
        ...d,
        motivo: d.motivo?.trim().slice(0, 1000) || null,
        status: d.status || 'pendente',
        etapa: d.etapa || 'comunicacao'
      };

      const { data, error } = await supabase.from('desligamentos').insert(sanitized).select().maybeSingle();
      if (error) throw error;

      if (data) {
        await auditLogger.log({
          tabela: 'desligamentos',
          registro_id: data.id,
          acao: 'INSERT',
          dados_novos: data,
        });
      }

      return (data);
    } catch (e: any) {
      throw new Error(e.message || 'Erro ao criar desligamento');
    }
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    if (!id) throw new Error('ID é obrigatório');

    try {
      const { data: anterior } = await supabase.from('desligamentos').select('*').eq('id', id).single();

      const { data, error } = await supabase.from('desligamentos').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;

      if (data) {
        await auditLogger.log({
          tabela: 'desligamentos',
          registro_id: id,
          acao: 'UPDATE',
          dados_anteriores: anterior,
          dados_novos: data,
        });
      }

      return (data);
    } catch (e: any) {
      throw new Error('Falha ao atualizar desligamento');
    }
  },
  
  async excluir(id: string): Promise<void> {
    if (!id) throw new Error('ID é obrigatório');
    
    try {
      const { data: anterior } = await supabase.from('desligamentos').select('*').eq('id', id).single();

      const { error } = await supabase.from('desligamentos').delete().eq('id', id);
      if (error) throw error;

      await auditLogger.log({
        tabela: 'desligamentos',
        registro_id: id,
        acao: 'DELETE',
        dados_anteriores: anterior,
      });
      return (undefined);
    } catch (e: any) {
      throw new Error('Falha ao excluir desligamento');
    }
  },
};


