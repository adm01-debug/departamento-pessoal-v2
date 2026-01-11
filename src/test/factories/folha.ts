// src/test/factories/folha.ts
import { FolhaPagamento, ItemFolha } from '@/types/folha';

let idCounter = 1;

export function createFolha(overrides: Partial<FolhaPagamento> = {}): FolhaPagamento {
  const id = String(idCounter++);
  return {
    id,
    empresa_id: '1',
    competencia: '2024-01',
    tipo: 'mensal',
    status: 'calculada',
    total_proventos: 5500,
    total_descontos: 1417.5,
    total_liquido: 4082.5,
    total_fgts: 440,
    data_calculo: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...overrides
  };
}

export function createFolhaList(count: number): FolhaPagamento[] {
  return Array.from({ length: count }, () => createFolha());
}

export function createItemFolha(overrides: Partial<ItemFolha> = {}): ItemFolha {
  const id = String(idCounter++);
  return {
    id,
    folha_id: '1',
    colaborador_id: '1',
    colaborador_nome: 'Colaborador Teste',
    salario_base: 5000,
    total_proventos: 5500,
    total_descontos: 1417.5,
    valor_liquido: 4082.5,
    inss: 605,
    irrf: 312.5,
    fgts: 440,
    ...overrides
  };
}
