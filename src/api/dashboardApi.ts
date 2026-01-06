import { supabase } from "@/integrations/supabase/client";

// Dashboard API - aggregates data from multiple tables

export interface DashboardStats {
  totalColaboradores: number;
  totalEmpresas: number;
  feriasAtivas: number;
  afastamentosAtivos: number;
  admissoesRecentes: number;
  folhasPendentes: number;
}

export async function getStats(): Promise<DashboardStats> {
  const [
    colaboradores,
    empresas,
    ferias,
    afastamentos,
    admissoes,
    folhas
  ] = await Promise.all([
    supabase.from("colaboradores").select("*", { count: "exact", head: true }).eq("status", "ativo"),
    supabase.from("empresas").select("*", { count: "exact", head: true }).eq("ativa", true),
    supabase.from("ferias").select("*", { count: "exact", head: true }).eq("status", "aprovado"),
    supabase.from("afastamentos").select("*", { count: "exact", head: true }).eq("status", "ativo"),
    supabase.from("admissoes").select("*", { count: "exact", head: true }),
    supabase.from("folhas_pagamento").select("*", { count: "exact", head: true }).eq("status", "aberta"),
  ]);

  return {
    totalColaboradores: colaboradores.count || 0,
    totalEmpresas: empresas.count || 0,
    feriasAtivas: ferias.count || 0,
    afastamentosAtivos: afastamentos.count || 0,
    admissoesRecentes: admissoes.count || 0,
    folhasPendentes: folhas.count || 0,
  };
}

// Stub implementations for CRUD operations (dashboard doesn't have its own table)
export async function list(_filters?: Record<string, any>) {
  return [];
}

export async function getById(_id: string) {
  return null;
}

export async function create(_data: any) {
  return null;
}

export async function update(_id: string, _data: any) {
  return null;
}

export async function remove(_id: string) {
  return false;
}

export async function count(_filters?: Record<string, any>) {
  return 0;
}

export default { getStats, list, getById, create, update, remove, count };
