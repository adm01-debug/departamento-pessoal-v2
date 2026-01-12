// V17: FolhaPagamentoService Real - Serviço de Folha de Pagamento
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface FolhaPagamento {
  id: string;
  empresa_id: string;
  competencia: string;
  status: 'aberta' | 'processando' | 'processada' | 'fechada' | 'cancelada';
  total_bruto: number;
  total_descontos: number;
  total_liquido: number;
  total_encargos: number;
  processada_em?: string;
  fechada_em?: string;
  created_at: string;
  updated_at: string;
}

export const folhaPagamentoServiceReal = {
  async getAll(empresaId: string): Promise<FolhaPagamento[]> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('competencia', { ascending: false });
    
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getById(id: string): Promise<FolhaPagamento | null> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getByCompetencia(empresaId: string, competencia: string): Promise<FolhaPagamento | null> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('competencia', competencia)
      .single();
    
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async criar(empresaId: string, competencia: string): Promise<FolhaPagamento> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .insert({
        empresa_id: empresaId,
        competencia,
        status: 'aberta',
        total_bruto: 0,
        total_descontos: 0,
        total_liquido: 0,
        total_encargos: 0
      })
      .select()
      .single();
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async processar(folhaId: string): Promise<FolhaPagamento> {
    await supabase
      .from('folhas_pagamento')
      .update({ status: 'processando' })
      .eq('id', folhaId);

    // Simula processamento
    const { data: itens } = await supabase
      .from('itens_folha')
      .select('*')
      .eq('folha_id', folhaId);

    let totalBruto = 0;
    let totalDescontos = 0;

    (itens || []).forEach(item => {
      if (item.tipo === 'provento') {
        totalBruto += item.valor;
      } else if (item.tipo === 'desconto') {
        totalDescontos += item.valor;
      }
    });

    const totalLiquido = totalBruto - totalDescontos;
    const totalEncargos = totalBruto * 0.368; // INSS patronal + FGTS + RAT + Terceiros

    const { data, error } = await supabase
      .from('folhas_pagamento')
      .update({
        status: 'processada',
        total_bruto: totalBruto,
        total_descontos: totalDescontos,
        total_liquido: totalLiquido,
        total_encargos: totalEncargos,
        processada_em: new Date().toISOString()
      })
      .eq('id', folhaId)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async fechar(folhaId: string): Promise<FolhaPagamento> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .update({
        status: 'fechada',
        fechada_em: new Date().toISOString()
      })
      .eq('id', folhaId)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async reabrir(folhaId: string): Promise<FolhaPagamento> {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .update({
        status: 'processada',
        fechada_em: null
      })
      .eq('id', folhaId)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async cancelar(folhaId: string): Promise<void> {
    const { error } = await supabase
      .from('folhas_pagamento')
      .update({ status: 'cancelada' })
      .eq('id', folhaId);

    if (error) throw new Error(handleSupabaseError(error));
  },

  async getResumo(folhaId: string) {
    const { data: folha } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('id', folhaId)
      .single();

    const { data: itens } = await supabase
      .from('itens_folha')
      .select('*, colaborador:colaboradores(nome)')
      .eq('folha_id', folhaId);

    return {
      folha,
      itens: itens || [],
      totalColaboradores: new Set((itens || []).map(i => i.colaborador_id)).size
    };
  }
};

export default folhaPagamentoServiceReal;
