export interface Backup {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface BackupCreate extends Omit<Backup, "id" | "createdAt" | "updatedAt"> {}
export interface BackupUpdate extends Partial<BackupCreate> {}
export interface BackupFilter { search?: string; status?: string; page?: number; limit?: number; }
export type BackupStatus = "ativo" | "inativo" | "pendente";
