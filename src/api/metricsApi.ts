// Metrics API - stub implementation

export interface Metric {
  id: string;
  nome: string;
  valor: number;
  tipo: string;
  data: Date;
}

export async function list(_filters?: Record<string, any>): Promise<Metric[]> {
  return [];
}

export async function getById(_id: string): Promise<Metric | null> {
  return null;
}

export async function create(_data: Partial<Metric>): Promise<Metric | null> {
  console.warn('Metrics create: not implemented');
  return null;
}

export async function update(_id: string, _data: Partial<Metric>): Promise<Metric | null> {
  console.warn('Metrics update: not implemented');
  return null;
}

export async function remove(_id: string): Promise<boolean> {
  console.warn('Metrics remove: not implemented');
  return false;
}

export async function count(_filters?: Record<string, any>): Promise<number> {
  return 0;
}

export default { list, getById, create, update, remove, count };
