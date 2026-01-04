export interface Index {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface IndexCreate extends Omit<Index, "id" | "createdAt" | "updatedAt"> {}
export interface IndexUpdate extends Partial<IndexCreate> {}
export interface IndexFilter { search?: string; status?: string; page?: number; limit?: number; }
export type IndexStatus = "ativo" | "inativo" | "pendente";
