// Notificacoes API - stub implementation

export interface Notificacao {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: 'SISTEMA' | 'TAREFA' | 'ALERTA' | 'LEMBRETE';
  lida: boolean;
  dataEnvio: Date;
}

export async function list(_filters?: Record<string, any>): Promise<Notificacao[]> {
  return [];
}

export async function getById(_id: string): Promise<Notificacao | null> {
  return null;
}

export async function create(_data: Partial<Notificacao>): Promise<Notificacao | null> {
  console.warn('Notificacoes create: not implemented');
  return null;
}

export async function update(_id: string, _data: Partial<Notificacao>): Promise<Notificacao | null> {
  console.warn('Notificacoes update: not implemented');
  return null;
}

export async function remove(_id: string): Promise<boolean> {
  console.warn('Notificacoes remove: not implemented');
  return false;
}

export async function count(_filters?: Record<string, any>): Promise<number> {
  return 0;
}

export async function marcarComoLida(_id: string): Promise<boolean> {
  return false;
}

export async function marcarTodasComoLidas(_usuarioId: string): Promise<boolean> {
  return false;
}

export default { list, getById, create, update, remove, count, marcarComoLida, marcarTodasComoLidas };
