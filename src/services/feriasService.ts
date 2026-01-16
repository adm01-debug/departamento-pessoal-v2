// V18-FIX: FeriasService - Production Ready with Supabase
// Atualizado em 16/01/2026 - Adicionado método listSolicitacoes
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Ferias, Insertable, Updatable } from '@/integrations/supabase/database.types';
import { addDays, differenceInDays, isAfter } from 'date-fns';

export interface FeriasWithColaborador extends Ferias {
  colaborador?: { id: string; nome: string; cpf: string; cargo?: { nome: string } };
}

export interface FeriasFilters {
  colaborador_id?: string;
  status?: string;
  empresa_id?: string;
  vencidas?: boolean;
}

export const feriasServiceReal = {
  async getAll(filters: FeriasFilters = {}): Promise<FeriasWithColaborador[]> {
    let query = supabase
      .from('ferias')
      .select(`
        *,
        colaborador:colaboradores(id, nome, cpf, cargo:cargos(nome))
      `)
      .order('periodo_aquisitivo_fim', { ascending: false });

    if (filters.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    
    let result = data || [];
    
    if (filters.vencidas) {
      const hoje = new Date();
      result = result.filter(f => {
        const vencimento = addDays(new Date(f.periodo_aquisitivo_fim), 365);
        return isAfter(hoje, vencimento) && f.status === 'pendente';
      });
    }
    
    return result as FeriasWithColaborador[];
  },

  // Alias para compatibilidade com FeriasPage
  async list(filters?: FeriasFilters): Promise<FeriasWithColaborador[]> {
    return this.getAll(filters || {});
  },

  // Método para listar solicitações (usado por FeriasPage)
  async listSolicitacoes(status?: string): Promise<FeriasWithColaborador[]> {
    return this.getAll(status ? { status } : {});
  },

  async getById(id: string): Promise<FeriasWithColaborador | null> {
    const { data, error } = await supabase
      .from('ferias')
      .select(`
        *,
        colaborador:colaboradores(id, nome, cpf, salario, cargo:cargos(nome))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data as FeriasWithColaborador;
  },

  async getByColaborador(colaboradorId: string): Promise<Ferias[]> {
    const { data, error } = await supabase
      .from('ferias')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('periodo_aquisitivo_inicio', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async create(ferias: Insertable<'ferias'>): Promise<Ferias> {
    const { data, error } = await supabase
      .from('ferias')
      .insert(ferias)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, ferias: Updatable<'ferias'>): Promise<Ferias> {
    const { data, error } = await supabase
      .from('ferias')
      .update({ ...ferias, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async aprovar(id: string): Promise<Ferias> {
    return this.update(id, { status: 'aprovada' });
  },

  async rejeitar(id: string, motivo?: string): Promise<Ferias> {
    return this.update(id, { status: 'recusada', observacao: motivo });
  },

  async programar(id: string, inicio: string, dias: number, diasAbono: number = 0): Promise<Ferias> {
    const fim = addDays(new Date(inicio), dias - 1).toISOString().split('T')[0];
    
    return this.update(id, {
      periodo_gozo_inicio: inicio,
      periodo_gozo_fim: fim,
      dias_gozo: dias,
      dias_abono: diasAbono,
      status: 'programada',
    });
  },

  async iniciar(id: string): Promise<Ferias> {
    return this.update(id, { status: 'em_gozo' });
  },

  async concluir(id: string): Promise<Ferias> {
    return this.update(id, { status: 'concluida' });
  },

  async cancelar(id: string): Promise<Ferias> {
    return this.update(id, {
      periodo_gozo_inicio: null,
      periodo_gozo_fim: null,
      status: 'pendente',
    });
  },

  async getVencendo(empresaId: string, diasAntecedencia: number = 60): Promise<FeriasWithColaborador[]> {
    const { data, error } = await supabase
      .from('ferias')
      .select(`
        *,
        colaborador:colaboradores!inner(id, nome, cpf, empresa_id)
      `)
      .eq('colaborador.empresa_id', empresaId)
      .eq('status', 'pendente');

    if (error) throw new Error(handleSupabaseError(error));

    const hoje = new Date();
    return (data || []).filter(f => {
      const vencimento = addDays(new Date(f.periodo_aquisitivo_fim), 365);
      const diasRestantes = differenceInDays(vencimento, hoje);
      return diasRestantes <= diasAntecedencia && diasRestantes > 0;
    }) as FeriasWithColaborador[];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('ferias').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
};

export default feriasServiceReal;
