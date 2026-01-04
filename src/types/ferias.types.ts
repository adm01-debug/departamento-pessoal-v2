export interface Ferias {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface FeriasCreate extends Omit<Ferias, "id" | "createdAt" | "updatedAt"> {}
export interface FeriasUpdate extends Partial<FeriasCreate> {}
export interface FeriasFilter { search?: string; status?: string; page?: number; limit?: number; }
export type FeriasStatus = "ativo" | "inativo" | "pendente";
