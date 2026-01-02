/**
 * Hook para buscar dados reais do Departamento Pessoal
 * MIGRAÇÃO: Mock → Produção
 * Substitui: src/data/mockData.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Colaborador {
  id: string;
  nome: string;
  matricula: string;
  cpf: string;
  cargo: string;
  departamento: string;
  status: 'ativo' | 'ferias' | 'afastado' | 'desligado' | 'admissao';
  data_admissao: string;
  data_demissao?: string;
  salario: number;
  foto?: string;
  gestor_id?: string;
  email: string;
  telefone?: string;
  endereco?: Record<string, string>;
  created_at: string;
}

export interface Ferias {
  id: string;
  colaborador_id: string;
  data_inicio: string;
  data_fim: string;
  dias: number;
  tipo: 'regular' | 'abono' | 'coletiva';
  status: 'solicitada' | 'aprovada' | 'em_andamento' | 'concluida' | 'cancelada';
  aprovador_id?: string;
}

export interface Ponto {
  id: string;
  colaborador_id: string;
  data: string;
  entrada: string;
  saida?: string;
  entrada_almoco?: string;
  saida_almoco?: string;
  horas_trabalhadas?: number;
  horas_extras?: number;
  status: 'normal' | 'falta' | 'atraso' | 'hora_extra' | 'justificado';
}

export interface Folha {
  id: string;
  colaborador_id: string;
  mes_referencia: string;
  salario_base: number;
  horas_extras: number;
  descontos: number;
  beneficios: number;
  inss: number;
  irrf: number;
  fgts: number;
  liquido: number;
  status: 'rascunho' | 'calculada' | 'aprovada' | 'paga';
}

// Hooks
export function useColaboradores(status?: string, departamento?: string) {
  return useQuery({
    queryKey: ['colaboradores', status, departamento],
    queryFn: async () => {
      let query = supabase.from('colaboradores').select('*').order('nome');
      if (status) query = query.eq('status', status);
      if (departamento) query = query.eq('departamento', departamento);
      const { data, error } = await query;
      if (error) throw error;
      return data as Colaborador[];
    },
  });
}

export function useColaborador(id: string) {
  return useQuery({
    queryKey: ['colaborador', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('colaboradores').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Colaborador;
    },
    enabled: !!id,
  });
}

export function useKPIs() {
  return useQuery({
    queryKey: ['dp-kpis'],
    queryFn: async () => {
      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = hoje.substring(0, 7);
      
      const [colaboradores, ferias, afastados, pontos, folhas] = await Promise.all([
        supabase.from('colaboradores').select('status'),
        supabase.from('ferias').select('id').eq('status', 'em_andamento').gte('data_inicio', hoje).lte('data_fim', hoje),
        supabase.from('colaboradores').select('id').eq('status', 'afastado'),
        supabase.from('pontos').select('id').eq('data', hoje).is('entrada', null),
        supabase.from('folhas').select('liquido').eq('mes_referencia', mesAtual),
      ]);
      
      const total = colaboradores.data?.length || 0;
      const ativos = colaboradores.data?.filter(c => c.status === 'ativo').length || 0;
      const admissoes = colaboradores.data?.filter(c => c.status === 'admissao').length || 0;
      
      return {
        colaboradoresAtivos: ativos,
        admissoesEmCurso: admissoes,
        feriasEsteMes: ferias.data?.length || 0,
        afastadosHoje: afastados.data?.length || 0,
        pontosPendentes: pontos.data?.length || 0,
        folhaProjetada: folhas.data?.reduce((a, f) => a + (f.liquido || 0), 0) || 0,
        desligamentosEmCurso: colaboradores.data?.filter(c => c.status === 'desligado').length || 0,
        totalColaboradores: total,
      };
    },
    refetchInterval: 60000, // Atualizar a cada minuto
  });
}

export function useFerias(colaboradorId?: string) {
  return useQuery({
    queryKey: ['ferias', colaboradorId],
    queryFn: async () => {
      let query = supabase.from('ferias').select('*, colaborador:colaboradores(nome)').order('data_inicio', { ascending: false });
      if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Ferias[];
    },
  });
}

export function usePontos(colaboradorId?: string, mes?: string) {
  return useQuery({
    queryKey: ['pontos', colaboradorId, mes],
    queryFn: async () => {
      let query = supabase.from('pontos').select('*, colaborador:colaboradores(nome)').order('data', { ascending: false });
      if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
      if (mes) query = query.gte('data', `${mes}-01`).lte('data', `${mes}-31`);
      const { data, error } = await query;
      if (error) throw error;
      return data as Ponto[];
    },
  });
}

export function useFolha(mes: string) {
  return useQuery({
    queryKey: ['folha', mes],
    queryFn: async () => {
      const { data, error } = await supabase.from('folhas').select('*, colaborador:colaboradores(nome, cargo)').eq('mes_referencia', mes);
      if (error) throw error;
      return data as Folha[];
    },
  });
}

// Mutations
export function useCreateColaborador() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (colaborador: Omit<Colaborador, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('colaboradores').insert(colaborador).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['colaboradores'] }); toast.success('Colaborador cadastrado!'); },
  });
}

export function useUpdateColaborador() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Colaborador> & { id: string }) => {
      const { error } = await supabase.from('colaboradores').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['colaboradores'] }); qc.invalidateQueries({ queryKey: ['colaborador', id] }); toast.success('Dados atualizados!'); },
  });
}

export function useRegistrarPonto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ponto: Omit<Ponto, 'id'>) => {
      const { data, error } = await supabase.from('pontos').insert(ponto).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pontos'] }); toast.success('Ponto registrado!'); },
  });
}

export default { useColaboradores, useColaborador, useKPIs, useFerias, usePontos, useFolha, useCreateColaborador, useUpdateColaborador, useRegistrarPonto };
