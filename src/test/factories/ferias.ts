// src/test/factories/ferias.ts
import { Ferias, SolicitacaoFerias } from '@/types/ferias';

let idCounter = 1;

export function createFerias(overrides: Partial<Ferias> = {}): Ferias {
  const id = String(idCounter++);
  return {
    id,
    colaborador_id: '1',
    periodo_aquisitivo_inicio: '2023-01-01',
    periodo_aquisitivo_fim: '2024-01-01',
    dias_direito: 30,
    dias_gozados: 0,
    dias_vendidos: 0,
    dias_restantes: 30,
    status: 'vigente',
    ...overrides
  };
}

export function createFeriasList(count: number): Ferias[] {
  return Array.from({ length: count }, () => createFerias());
}

export function createSolicitacaoFerias(overrides: Partial<SolicitacaoFerias> = {}): SolicitacaoFerias {
  const id = String(idCounter++);
  return {
    id,
    colaborador_id: '1',
    colaborador_nome: 'Colaborador Teste',
    data_inicio: '2024-01-01',
    data_fim: '2024-01-30',
    dias_solicitados: 30,
    abono_pecuniario: false,
    dias_abono: 0,
    adiantamento_13: false,
    status: 'pendente',
    created_at: new Date().toISOString(),
    ...overrides
  };
}
