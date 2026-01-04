export interface Dependente {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface DependenteCreate extends Omit<Dependente, "id" | "createdAt" | "updatedAt"> {}
export interface DependenteUpdate extends Partial<DependenteCreate> {}
export interface DependenteFilter { search?: string; status?: string; page?: number; limit?: number; }
export type DependenteStatus = "ativo" | "inativo" | "pendente";
