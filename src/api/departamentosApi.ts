// Departamentos API - stub implementation (no separate departamentos table)
// Departamentos are stored as text field in colaboradores table

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export async function list(_filters?: Record<string, any>): Promise<Departamento[]> {
  // Stub: return empty array - departamentos are embedded in colaboradores
  return [];
}

export async function getById(_id: string): Promise<Departamento | null> {
  return null;
}

export async function create(_data: Partial<Departamento>): Promise<Departamento | null> {
  console.warn('Departamentos create: not implemented');
  return null;
}

export async function update(_id: string, _data: Partial<Departamento>): Promise<Departamento | null> {
  console.warn('Departamentos update: not implemented');
  return null;
}

export async function remove(_id: string): Promise<boolean> {
  console.warn('Departamentos remove: not implemented');
  return false;
}

export async function count(_filters?: Record<string, any>): Promise<number> {
  return 0;
}

export default { list, getById, create, update, remove, count };
