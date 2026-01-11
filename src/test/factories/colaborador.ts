// src/test/factories/colaborador.ts
import { Colaborador } from '@/types/colaborador';

let idCounter = 1;

export function createColaborador(overrides: Partial<Colaborador> = {}): Colaborador {
  const id = String(idCounter++);
  return {
    id,
    empresa_id: '1',
    nome: `Colaborador ${id}`,
    cpf: '529.982.247-25',
    email: `colaborador${id}@email.com`,
    telefone: '11999998888',
    data_nascimento: '1990-01-01',
    data_admissao: '2023-01-01',
    salario: 5000,
    cargo_id: '1',
    cargo: 'Desenvolvedor',
    departamento_id: '1',
    departamento: 'TI',
    tipo_contrato: 'clt',
    status: 'ativo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

export function createColaboradores(count: number): Colaborador[] {
  return Array.from({ length: count }, () => createColaborador());
}
