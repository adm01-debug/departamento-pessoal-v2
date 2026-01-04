// backup.ts - Type definitions

export interface Backup {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BackupCreate extends Omit<Backup, "id" | "createdAt" | "updatedAt"> {}

export interface BackupUpdate extends Partial<Omit<Backup, "id" | "createdAt">> {}

export interface BackupFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface BackupListResponse {
  data: Backup[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type BackupStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isBackup(obj: any): obj is Backup {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
