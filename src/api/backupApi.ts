// Backup API - stub implementation (no database table)

export interface Backup {
  id: string;
  nome: string;
  data: Date;
  tamanho: number;
  status: 'concluido' | 'pendente' | 'erro';
}

export async function list(_filters?: Record<string, any>): Promise<Backup[]> {
  // Stub: return empty array - needs backend implementation
  return [];
}

export async function getById(_id: string): Promise<Backup | null> {
  return null;
}

export async function create(_data: Partial<Backup>): Promise<Backup | null> {
  console.warn('Backup create: not implemented');
  return null;
}

export async function update(_id: string, _data: Partial<Backup>): Promise<Backup | null> {
  console.warn('Backup update: not implemented');
  return null;
}

export async function remove(_id: string): Promise<boolean> {
  console.warn('Backup remove: not implemented');
  return false;
}

export async function count(_filters?: Record<string, any>): Promise<number> {
  return 0;
}

export default { list, getById, create, update, remove, count };
