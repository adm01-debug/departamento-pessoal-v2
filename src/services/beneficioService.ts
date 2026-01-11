// V15-212: src/services/beneficioService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Beneficio, BeneficioColaborador, BeneficioFormData, AtribuirBeneficioData } from '@/types';

export const beneficioService = {
  async list(empresaId: string) {
    const { data, error } = await supabase.from('beneficios').select('*').eq('empresa_id', empresaId).order('nome');
    if (error) throw error;
    return data as Beneficio[];
  },

  async create(data: BeneficioFormData) {
    const { data: created, error } = await supabase.from('beneficios').insert(data).select().single();
    if (error) throw error;
    return created as Beneficio;
  },

  async update(id: string, data: Partial<BeneficioFormData>) {
    const { data: updated, error } = await supabase.from('beneficios').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated as Beneficio;
  },

  async atribuir(data: AtribuirBeneficioData) {
    const inserts = data.colaborador_ids.map(colaborador_id => ({
      beneficio_id: data.beneficio_id,
      colaborador_id,
      data_inicio: data.data_inicio,
      ativo: true,
    }));
    const { error } = await supabase.from('beneficios_colaboradores').insert(inserts);
    if (error) throw error;
  },

  async listByColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('beneficios_colaboradores').select('*, beneficio:beneficios(*)').eq('colaborador_id', colaboradorId).eq('ativo', true);
    if (error) throw error;
    return data;
  }
};
