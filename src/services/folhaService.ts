import { supabase } from '@/integrations/supabase/client';
import { Holerite, FolhaPagamento } from '@/types/folha';
import { logger } from '@/lib/logger';

const HOLERITE_FIELDS = 'id, colaborador_id, mes, ano, salario_base, total_proventos, total_descontos, salario_liquido, inss, irrf, fgts, status, empresa_id, created_at';

export const folhaService = {
  async listarHolerites(mes: number, ano: number, empresa_id?: string): Promise<Holerite[]> {
    try {
      let query = supabase
        .from('holerites')
        .select(`${HOLERITE_FIELDS}, colaboradores(nome, cargo)`)
        .eq('mes', mes)
        .eq('ano', ano);
      
      if (empresa_id) query = query.eq('empresa_id', empresa_id);
      
      const { data, error } = await query.order('colaboradores(nome)');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar holerites:', error);
      throw error;
    }
  },

  async buscarHolerite(colaborador_id: string, mes: number, ano: number): Promise<Holerite | null> {
    try {
      const { data, error } = await supabase
        .from('holerites')
        .select(HOLERITE_FIELDS)
        .eq('colaborador_id', colaborador_id)
        .eq('mes', mes)
        .eq('ano', ano)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar holerite:', error);
      throw error;
    }
  },

  async gerarFolha(mes: number, ano: number, empresa_id: string): Promise<FolhaPagamento> {
    try {
      const { data, error } = await supabase.rpc('gerar_folha_pagamento', { p_mes: mes, p_ano: ano, p_empresa_id: empresa_id });
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao gerar folha de pagamento:', error);
      throw error;
    }
  },

  async fecharFolha(mes: number, ano: number, empresa_id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('folha_pagamento')
        .update({ status: 'fechada', data_fechamento: new Date().toISOString() })
        .eq('mes', mes)
        .eq('ano', ano)
        .eq('empresa_id', empresa_id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao fechar folha:', error);
      throw error;
    }
  },

  async calcularTotais(mes: number, ano: number, empresa_id: string): Promise<{ proventos: number; descontos: number; liquido: number }> {
    try {
      const holerites = await this.listarHolerites(mes, ano, empresa_id);
      return holerites.reduce((acc, h) => ({
        proventos: acc.proventos + (h.total_proventos ?? 0),
        descontos: acc.descontos + (h.total_descontos ?? 0),
        liquido: acc.liquido + (h.salario_liquido ?? 0),
      }), { proventos: 0, descontos: 0, liquido: 0 });
    } catch (error) {
      logger.error('Erro ao calcular totais da folha:', error);
      throw error;
    }
  },
};

export default folhaService;
