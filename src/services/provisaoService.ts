import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err, toResult } from '@/types/result';

export const provisaoService = {
  async list(empresaId?: string, competencia?: string): Promise<Result<any[]>> {
    return toResult((async () => {
      let query = supabase
        .from('provisoes_mensais')
        .select('*, colaborador:colaboradores(nome_completo, salario_base)')
        .order('competencia', { ascending: false });
      
      if (empresaId) query = query.eq('empresa_id', empresaId);
      if (competencia) query = query.eq('competencia', competencia);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    })());
  },
  
  async calcular(empresaId: string, competencia: string): Promise<Result<any>> {
    return toResult((async () => {
      const { data, error } = await supabase.functions.invoke('calcular-provisoes', {
        body: { empresa_id: empresaId, competencia }
      });
      if (error) throw error;
      return data;
    })());
  }
};

