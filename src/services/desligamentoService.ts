import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';
import { Result, Ok, Err, toResult } from '@/types/result';

export const desligamentoService = {
  async listar(empresaId?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase
        .from('desligamentos')
        .select('*, colaborador:colaboradores(nome_completo)')
        .order('data_desligamento', { ascending: false })
        .limit(500);
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async buscarPorId(id: string): Promise<Result<any | null>> {
    if (!id) return Err({
      type: 'VALIDATION_ERROR',
      severity: 'error',
      message: 'ID é obrigatório',
      timestamp: new Date()
    });
    
    return toResult((async () => {
      const { data, error } = await supabase.from('desligamentos').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    })());
  },
  
  async criar(d: any): Promise<Result<any>> {
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

      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'VALIDATION_ERROR',
        severity: 'error',
        message: e.message || 'Erro ao criar desligamento',
        timestamp: new Date()
      });
    }
  },
  
  async atualizar(id: string, d: any): Promise<Result<any>> {
    if (!id) return Err({
      type: 'VALIDATION_ERROR',
      severity: 'error',
      message: 'ID é obrigatório',
      timestamp: new Date()
    });

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

      return Ok(data);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao atualizar desligamento',
        timestamp: new Date()
      });
    }
  },
  
  async excluir(id: string): Promise<Result<void>> {
    if (!id) return Err({
      type: 'VALIDATION_ERROR',
      severity: 'error',
      message: 'ID é obrigatório',
      timestamp: new Date()
    });
    
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
      return Ok(undefined);
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'error',
        message: 'Falha ao excluir desligamento',
        timestamp: new Date()
      });
    }
  },
};


