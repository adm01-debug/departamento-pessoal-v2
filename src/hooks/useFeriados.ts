// @ts-nocheck
/**
 * @fileoverview Hook para gerenciamento de feriados
 * @module hooks/useFeriados
 */
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface Feriado {
  id: string;
  data: string;
  descricao: string;
  tipo: 'nacional' | 'estadual' | 'municipal';
  uf?: string;
  cidade?: string;
  created_at: string;
}

interface FeriadoAPI {
  date: string;
  name: string;
  type: string;
}

// Feriados nacionais fixos (para fallback)
const FERIADOS_NACIONAIS_FIXOS = [
  { dia: 1, mes: 1, descricao: 'Confraternização Universal' },
  { dia: 21, mes: 4, descricao: 'Tiradentes' },
  { dia: 1, mes: 5, descricao: 'Dia do Trabalho' },
  { dia: 7, mes: 9, descricao: 'Independência do Brasil' },
  { dia: 12, mes: 10, descricao: 'Nossa Senhora Aparecida' },
  { dia: 2, mes: 11, descricao: 'Finados' },
  { dia: 15, mes: 11, descricao: 'Proclamação da República' },
  { dia: 25, mes: 12, descricao: 'Natal' },
];

// Calcula Páscoa usando algoritmo de Gauss
function calcularPascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

// Gera feriados móveis baseados na Páscoa
function gerarFeriadosMoveis(ano: number): { data: string; descricao: string }[] {
  const pascoa = calcularPascoa(ano);
  
  const carnaval = new Date(pascoa);
  carnaval.setDate(pascoa.getDate() - 47);
  
  const quartaCinzas = new Date(pascoa);
  quartaCinzas.setDate(pascoa.getDate() - 46);
  
  const sextaSanta = new Date(pascoa);
  sextaSanta.setDate(pascoa.getDate() - 2);
  
  const corpusChristi = new Date(pascoa);
  corpusChristi.setDate(pascoa.getDate() + 60);
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  return [
    { data: formatDate(carnaval), descricao: 'Carnaval' },
    { data: formatDate(sextaSanta), descricao: 'Sexta-feira Santa' },
    { data: formatDate(pascoa), descricao: 'Páscoa' },
    { data: formatDate(corpusChristi), descricao: 'Corpus Christi' },
  ];
}

// Gera todos os feriados de um ano
function gerarFeriadosAno(ano: number): Omit<Feriado, 'id' | 'created_at'>[] {
  const feriados: Omit<Feriado, 'id' | 'created_at'>[] = [];
  
  // Feriados fixos
  FERIADOS_NACIONAIS_FIXOS.forEach(f => {
    const data = new Date(ano, f.mes - 1, f.dia);
    feriados.push({
      data: data.toISOString().split('T')[0],
      descricao: f.descricao,
      tipo: 'nacional',
    });
  });
  
  // Feriados móveis
  const moveis = gerarFeriadosMoveis(ano);
  moveis.forEach(f => {
    feriados.push({
      data: f.data,
      descricao: f.descricao,
      tipo: 'nacional',
    });
  });
  
  return feriados.sort((a, b) => a.data.localeCompare(b.data));
}

export function useFeriados(ano?: number) {
  const queryClient = useQueryClient();
  const anoAtual = ano || new Date().getFullYear();
  
  // Buscar feriados do banco
  const { data: feriados = [], isLoading, refetch } = useQuery({
    queryKey: ['feriados', anoAtual],
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feriados')
        .select('id, data, nome, tipo, uf')
        .gte('data', `${anoAtual}-01-01`)
        .lte('data', `${anoAtual}-12-31`)
        .order('data', { ascending: true });
      
      if (error) throw error;
      return data as Feriado[];
    },
  });
  
  // Sincronizar feriados nacionais automaticamente
  const sincronizarFeriados = useMutation({
    mutationFn: async (anoSync: number) => {
      const feriadosGerados = gerarFeriadosAno(anoSync);
      
      // Verificar quais já existem
      const { data: existentes } = await supabase
        .from('feriados')
        .select('data')
        .gte('data', `${anoSync}-01-01`)
        .lte('data', `${anoSync}-12-31`);
      
      const datasExistentes = new Set(existentes?.map(f => f.data) ?? []);
      
      // Filtrar apenas novos
      const novos = feriadosGerados.filter(f => !datasExistentes.has(f.data));
      
      if (novos.length === 0) {
        return { inserted: 0 };
      }
      
      const { error } = await supabase
        .from('feriados')
        .insert(novos);
      
      if (error) throw error;
      
      return { inserted: novos.length };
    },
    onSuccess: (result) => {
      if (result.inserted > 0) {
        toast.success(`${result.inserted} feriados sincronizados!`);
      } else {
        toast.info('Feriados já estão atualizados');
      }
      queryClient.invalidateQueries({ queryKey: ['feriados'] });
    },
    onError: () => {
      toast.error('Erro ao sincronizar feriados');
    },
  });
  
  // Adicionar feriado manualmente
  const adicionarFeriado = useMutation({
    mutationFn: async (feriado: Omit<Feriado, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('feriados')
        .insert(feriado);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Feriado adicionado!');
      queryClient.invalidateQueries({ queryKey: ['feriados'] });
    },
    onError: () => {
      toast.error('Erro ao adicionar feriado');
    },
  });
  
  // Remover feriado
  const removerFeriado = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feriados')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Feriado removido!');
      queryClient.invalidateQueries({ queryKey: ['feriados'] });
    },
    onError: () => {
      toast.error('Erro ao remover feriado');
    },
  });
  
  // Verificar se uma data é feriado
  const isFeriado = useCallback((data: string) => {
    return feriados.some(f => f.data === data);
  }, [feriados]);
  
  // Obter próximos feriados
  const proximosFeriados = useCallback((quantidade: number = 5) => {
    const hoje = new Date().toISOString().split('T')[0];
    return feriados
      .filter(f => f.data >= hoje)
      .slice(0, quantidade);
  }, [feriados]);
  
  return {
    feriados,
    isLoading,
    refetch,
    sincronizarFeriados: sincronizarFeriados.mutate,
    isSincronizando: sincronizarFeriados.isPending,
    adicionarFeriado: adicionarFeriado.mutate,
    removerFeriado: removerFeriado.mutate,
    isFeriado,
    proximosFeriados,
    gerarFeriadosAno,
  };
}








