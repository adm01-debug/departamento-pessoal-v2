import { supabase } from '@/integrations/supabase/client';
import { Holerite, FolhaPagamento } from '@/types/folha';

export const folhaService = {
  async listarHolerites(mes: number, ano: number, empresa_id?: string): Promise<Holerite[]> {
    let query = supabase
      .from('holerites')
      .select('*, colaboradores(nome, cargo)')
      .eq('mes', mes)
      .eq('ano', ano);
    
    if (empresa_id) query = query.eq('empresa_id', empresa_id);
    
    const { data, error } = await query.order('colaboradores(nome)');
    if (error) throw error;
    return data ?? [];
  },

  async buscarHolerite(colaborador_id: string, mes: number, ano: number): Promise<Holerite | null> {
    const { data, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('colaborador_id', colaborador_id)
      .eq('mes', mes)
      .eq('ano', ano)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async gerarFolha(mes: number, ano: number, empresa_id: string): Promise<FolhaPagamento> {
    const { data, error } = await supabase.rpc('gerar_folha_pagamento', { p_mes: mes, p_ano: ano, p_empresa_id: empresa_id });
    if (error) throw error;
    return data;
  },

  async fecharFolha(mes: number, ano: number, empresa_id: string): Promise<void> {
    const { error } = await supabase
      .from('folha_pagamento')
      .update({ status: 'fechada', data_fechamento: new Date().toISOString() })
      .eq('mes', mes)
      .eq('ano', ano)
      .eq('empresa_id', empresa_id);
    if (error) throw error;
  },

  async calcularTotais(mes: number, ano: number, empresa_id: string): Promise<{ proventos: number; descontos: number; liquido: number }> {
    const holerites = await this.listarHolerites(mes, ano, empresa_id);
    return holerites.reduce((acc, h) => ({
      proventos: acc.proventos + (h.total_proventos ?? 0),
      descontos: acc.descontos + (h.total_descontos ?? 0),
      liquido: acc.liquido + (h.salario_liquido ?? 0),
    }), { proventos: 0, descontos: 0, liquido: 0 });
  },
};

export default folhaService;

