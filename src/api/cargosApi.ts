// Cargos API - stub implementation (no separate cargos table)
// Cargos are stored as text field in colaboradores table

export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export async function list(_filters?: Record<string, any>): Promise<Cargo[]> {
  // Stub: return empty array - cargos are embedded in colaboradores
  return [];
}

export async function getById(_id: string): Promise<Cargo | null> {
  return null;
}

export async function create(_data: Partial<Cargo>): Promise<Cargo | null> {
  console.warn('Cargos create: not implemented - cargos are managed via colaboradores');
  return null;
}

export async function update(_id: string, _data: Partial<Cargo>): Promise<Cargo | null> {
  console.warn('Cargos update: not implemented');
  return null;
}

export async function remove(_id: string): Promise<boolean> {
  console.warn('Cargos remove: not implemented');
  return false;
}

export async function count(_filters?: Record<string, any>): Promise<number> {
  return 0;
}

export default { list, getById, create, update, remove, count };
