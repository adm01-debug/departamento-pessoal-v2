/**
 * Hook para gerenciamento de colaboradores
 * CRUD completo com cache e filtros
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  data_admissao: string;
  data_demissao?: string;
  cargo_id?: string;
  departamento_id?: string;
  salario: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
  tipo_contrato: 'clt' | 'pj' | 'estagiario' | 'temporario';
  created_at: string;
  updated_at?: string;
  // Joins
  cargo?: { id: string; nome: string };
  departamento?: { id: string; nome: string };
}

export interface FiltrosColaborador {
  busca?: string;
  status?: string;
  departamento_id?: string;
  cargo_id?: string;
  tipo_contrato?: string;
}

export interface UseColaboradoresReturn {
  colaboradores: Colaborador[];
  loading: boolean;
  error: string | null;
  total: number;
  buscar: (id: string) => Promise<Colaborador | null>;
  criar: (dados: Partial<Colaborador>) => Promise<Colaborador>;
  atualizar: (id: string, dados: Partial<Colaborador>) => Promise<Colaborador>;
  excluir: (id: string) => Promise<void>;
  recarregar: () => Promise<void>;
  filtros: FiltrosColaborador;
  setFiltros: (filtros: FiltrosColaborador) => void;
}

export function useColaboradores(filtrosIniciais?: FiltrosColaborador): UseColaboradoresReturn {
  const { toast } = useToast();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosColaborador>(filtrosIniciais || {});

  const carregarColaboradores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('colaboradores')
        .select('*, cargo:cargos(id, nome), departamento:departamentos(id, nome)')
        .order('nome');

      // Aplicar filtros
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.departamento_id) {
        query = query.eq('departamento_id', filtros.departamento_id);
      }
      if (filtros.cargo_id) {
        query = query.eq('cargo_id', filtros.cargo_id);
      }
      if (filtros.tipo_contrato) {
        query = query.eq('tipo_contrato', filtros.tipo_contrato);
      }
      if (filtros.busca) {
        query = query.or(`nome.ilike.%${filtros.busca}%,cpf.ilike.%${filtros.busca}%,email.ilike.%${filtros.busca}%`);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setColaboradores(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar colaboradores';
      setError(message);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [filtros, toast]);

  useEffect(() => {
    carregarColaboradores();
  }, [carregarColaboradores]);

  const buscar = useCallback(async (id: string): Promise<Colaborador | null> => {
    try {
      const { data, error: queryError } = await supabase
        .from('colaboradores')
        .select('*, cargo:cargos(id, nome), departamento:departamentos(id, nome)')
        .eq('id', id)
        .single();

      if (queryError) throw queryError;
      return data;
    } catch (err) {
      toast({ title: 'Erro', description: 'Colaborador não encontrado', variant: 'destructive' });
      return null;
    }
  }, [toast]);

  const criar = useCallback(async (dados: Partial<Colaborador>): Promise<Colaborador> => {
    try {
      const { data, error: insertError } = await supabase
        .from('colaboradores')
        .insert([{ ...dados, status: dados.status || 'ativo' }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      toast({ title: 'Sucesso', description: 'Colaborador criado com sucesso' });
      await carregarColaboradores();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar colaborador';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      throw err;
    }
  }, [toast, carregarColaboradores]);

  const atualizar = useCallback(async (id: string, dados: Partial<Colaborador>): Promise<Colaborador> => {
    try {
      const { data, error: updateError } = await supabase
        .from('colaboradores')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      toast({ title: 'Sucesso', description: 'Colaborador atualizado com sucesso' });
      await carregarColaboradores();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar colaborador';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      throw err;
    }
  }, [toast, carregarColaboradores]);

  const excluir = useCallback(async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      toast({ title: 'Sucesso', description: 'Colaborador excluído com sucesso' });
      await carregarColaboradores();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir colaborador';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
      throw err;
    }
  }, [toast, carregarColaboradores]);

  const total = useMemo(() => colaboradores.length, [colaboradores]);

  return {
    colaboradores,
    loading,
    error,
    total,
    buscar,
    criar,
    atualizar,
    excluir,
    recarregar: carregarColaboradores,
    filtros,
    setFiltros
  };
}

export default useColaboradores;
