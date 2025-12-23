import { supabase } from '@/integrations/supabase/client';
import { RegistroPonto, PontoFilters } from '@/types/ponto';
import { logger } from '@/lib/logger';

export const pontoService = {
  async listar(filters: PontoFilters): Promise<RegistroPonto[]> {
    try {
      let query = supabase.from('registros_ponto').select('id, colaborador_id, data, entrada, saida, intervalo_inicio, intervalo_fim, horas_extras, observacoes, status, created_at, colaboradores(nome)');
      
      if (filters.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
      if (filters.data_inicio) query = query.gte('data', filters.data_inicio);
      if (filters.data_fim) query = query.lte('data', filters.data_fim);
      
      const { data, error } = await query.order('data', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar registros de ponto:', error);
      throw error;
    }
  },

  async registrar(colaborador_id: string, tipo: 'entrada' | 'saida'): Promise<RegistroPonto> {
    try {
      const agora = new Date();
      const data = agora.toISOString().split('T')[0];
      const hora = agora.toTimeString().split(' ')[0];

      const { data: registro, error } = await supabase
        .from('registros_ponto')
        .insert({
          colaborador_id,
          data,
          [tipo === 'entrada' ? 'entrada' : 'saida']: hora,
        })
        .select()
        .single();
      
      if (error) throw error;
      return registro;
    } catch (error) {
      logger.error('Erro ao registrar ponto:', error);
      throw error;
    }
  },

  async calcularHorasTrabalhadas(colaborador_id: string, mes: number, ano: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('registros_ponto')
        .select('entrada, saida')
        .eq('colaborador_id', colaborador_id)
        .gte('data', `${ano}-${String(mes).padStart(2, '0')}-01`)
        .lte('data', `${ano}-${String(mes).padStart(2, '0')}-31`);
      
      if (error) throw error;
      
      return (data ?? []).reduce((total, r) => {
        if (r.entrada && r.saida) {
          const [eh, em] = r.entrada.split(':').map(Number);
          const [sh, sm] = r.saida.split(':').map(Number);
          total += (sh * 60 + sm) - (eh * 60 + em);
        }
        return total;
      }, 0);
    } catch (error) {
      logger.error('Erro ao calcular horas trabalhadas:', error);
      throw error;
    }
  },

  async gerarRelatorio(empresa_id: string, mes: number, ano: number) {
    try {
      const { data, error } = await supabase.rpc('relatorio_ponto_mensal', { p_empresa_id: empresa_id, p_mes: mes, p_ano: ano });
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao gerar relatório de ponto:', error);
      throw error;
    }
  },
};

export default pontoService;
