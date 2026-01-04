export interface Auditoria {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface AuditoriaCreate extends Omit<Auditoria, "id" | "createdAt" | "updatedAt"> {}
export interface AuditoriaUpdate extends Partial<AuditoriaCreate> {}
export interface AuditoriaFilter { search?: string; status?: string; page?: number; limit?: number; }
export type AuditoriaStatus = "ativo" | "inativo" | "pendente";
