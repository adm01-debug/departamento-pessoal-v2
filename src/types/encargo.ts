export interface Encargo {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface EncargoCreate extends Omit<Encargo, "id" | "createdAt" | "updatedAt"> {}
export interface EncargoUpdate extends Partial<EncargoCreate> {}
export interface EncargoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type EncargoStatus = "ativo" | "inativo" | "pendente";
