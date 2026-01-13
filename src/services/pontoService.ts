// V16-013: PontoService - Production Ready with Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { PontoRegistro, Insertable, Updatable } from '@/integrations/supabase/database.types';
import { format } from 'date-fns';

export interface PontoFilters {
  colaborador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  tipo?: string;
}

export interface PontoWithColaborador extends PontoRegistro {
  colaborador?: { id: string; nome: string };
}

export const pontoServiceReal = {
  async getAll(filters: PontoFilters = {}): Promise<PontoWithColaborador[]> {
    let query = supabase
      .from('ponto_registros')
      .select(`*, colaborador:colaboradores(id, nome)`)
      .order('data', { ascending: false });

    if (filters.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
    if (filters.data_inicio) query = query.gte('data', filters.data_inicio);
    if (filters.data_fim) query = query.lte('data', filters.data_fim);
    if (filters.tipo) query = query.eq('tipo', filters.tipo);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getById(id: string): Promise<PontoRegistro | null> {
    const { data, error } = await supabase
      .from('ponto_registros')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  async getByData(colaboradorId: string, data: string): Promise<PontoRegistro | null> {
    const { data: registro, error } = await supabase
      .from('ponto_registros')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('data', data)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return registro;
  },

  async registrar(colaboradorId: string, tipo: 'entrada' | 'saida'): Promise<PontoRegistro> {
    const hoje = format(new Date(), 'yyyy-MM-dd');
    const agora = format(new Date(), 'HH:mm:ss');
    
    let registro = await this.getByData(colaboradorId, hoje);
    
    if (!registro) {
      const { data, error } = await supabase
        .from('ponto_registros')
        .insert({
          colaborador_id: colaboradorId,
          data: hoje,
          entrada_1: tipo === 'entrada' ? agora : null,
        })
        .select()
        .single();

      if (error) throw new Error(handleSupabaseError(error));
      return data;
    }

    const updates: Updatable<'ponto_registros'> = {};
    if (tipo === 'entrada') {
      if (!registro.entrada_1) updates.entrada_1 = agora;
      else if (!registro.entrada_2) updates.entrada_2 = agora;
      else if (!registro.entrada_3) updates.entrada_3 = agora;
    } else {
      if (!registro.saida_1 && registro.entrada_1) updates.saida_1 = agora;
      else if (!registro.saida_2 && registro.entrada_2) updates.saida_2 = agora;
      else if (!registro.saida_3 && registro.entrada_3) updates.saida_3 = agora;
    }

    return this.update(registro.id, updates);
  },

  async create(ponto: Insertable<'ponto_registros'>): Promise<PontoRegistro> {
    const { data, error } = await supabase
      .from('ponto_registros')
      .insert(ponto)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, ponto: Updatable<'ponto_registros'>): Promise<PontoRegistro> {
    const { data, error } = await supabase
      .from('ponto_registros')
      .update({ ...ponto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('ponto_registros').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },

  async abonar(id: string, justificativa: string): Promise<PontoRegistro> {
    return this.update(id, { abonado: true, justificativa });
  },
};

export default pontoServiceReal;
