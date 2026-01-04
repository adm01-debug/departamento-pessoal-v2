export interface Api {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ApiCreate extends Omit<Api, "id" | "createdAt" | "updatedAt"> {}
export interface ApiUpdate extends Partial<ApiCreate> {}
export interface ApiFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ApiStatus = "ativo" | "inativo" | "pendente";
