/**
 * @fileoverview Service para gerenciamento de desligamentos
 * @module services/desligamentosService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Desligamento, DesligamentoFormData } from '@/types/desligamento';

export const desligamentosService = {
  async listar(): Promise<Desligamento[]> {
    const { data, error } = await supabase.from('desligamentos').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async buscarPorId(id: string): Promise<Desligamento | null> {
    const { data, error } = await supabase.from('desligamentos').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async criar(dados: DesligamentoFormData): Promise<Desligamento> {
    const { data, error } = await supabase.from('desligamentos').insert(dados).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async calcularRescisao(colaboradorId: string, tipo: string, dataDesligamento: string) {
    // Implementar cálculo de rescisão
    return { saldoSalario: 0, avisoPrevoio: 0, feriasVencidas: 0, feriasProporcionais: 0, tercoConstitucional: 0, decimoTerceiro: 0, fgts: 0, multaFgts: 0, total: 0 };
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('desligamentos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
