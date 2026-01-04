export interface Aso {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface AsoCreate extends Omit<Aso, "id" | "createdAt" | "updatedAt"> {}
export interface AsoUpdate extends Partial<AsoCreate> {}
export interface AsoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type AsoStatus = "ativo" | "inativo" | "pendente";
