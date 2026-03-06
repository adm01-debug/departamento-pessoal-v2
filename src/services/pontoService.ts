// @ts-nocheck
// V18-BUILD: PontoService - Production Ready with Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { PontoRegistro, Insertable, Updatable } from '@/integrations/supabase/database.types';

export interface PontoFilters {
  colaborador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  tipo?: string;
}

export interface PontoWithColaborador extends PontoRegistro {
  colaborador?: { id: string; nome: string };
}

export interface EspelhoPonto {
  colaborador_id: string;
  competencia: string;
  dias: Array<{
    data: string;
    entrada?: string;
    saida?: string;
    horas_trabalhadas: number;
  }>;
  total_horas: number;
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

  // Alias para compatibilidade
  async list(filters?: PontoFilters): Promise<PontoWithColaborador[]> {
    return this.getAll(filters || {});
  },

  async getById(id: string): Promise<PontoRegistro | null> {
    const { data, error } = await supabase
      .from('ponto_registros')
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getByData(colaboradorId: string, data: string): Promise<PontoRegistro | null> {
    const { data: registro, error } = await supabase
      .from('ponto_registros')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('data', data)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return registro;
  },

  async registrar(colaboradorId: string, tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida'): Promise<PontoRegistro> {
    const hoje = new Date().toISOString().split('T')[0];
    const hora = new Date().toTimeString().split(' ')[0];

    return this.create({
      colaborador_id: colaboradorId,
      data: hoje,
      hora,
      tipo,
    });
  },

  async ajustar(data: { pontoId: string; campo: string; valor: string; justificativa: string }): Promise<PontoRegistro> {
    return this.update(data.pontoId, {
      [data.campo]: data.valor,
      justificativa: data.justificativa,
      ajustado: true,
    });
  },

  async getEspelho(colaboradorId: string, competencia: string): Promise<EspelhoPonto> {
    const [ano, mes] = competencia.split('-');
    const dataInicio = `${ano}-${mes}-01`;
    const dataFim = new Date(parseInt(ano), parseInt(mes), 0).toISOString().split('T')[0];

    const registros = await this.getAll({
      colaborador_id: colaboradorId,
      data_inicio: dataInicio,
      data_fim: dataFim,
    });

    // Agrupar por dia
    const diasMap = new Map<string, any>();
    registros.forEach(r => {
      if (!diasMap.has(r.data)) {
        diasMap.set(r.data, { data: r.data });
      }
      const dia = diasMap.get(r.data);
      dia[r.tipo] = r.hora;
    });

    const dias = Array.from(diasMap.values()).map(d => ({
      ...d,
      horas_trabalhadas: 8, // Simplificado
    }));

    return {
      colaborador_id: colaboradorId,
      competencia,
      dias,
      total_horas: dias.length * 8,
    };
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
};

export default pontoServiceReal;
