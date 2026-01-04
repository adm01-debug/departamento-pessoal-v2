export interface Integracao {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface IntegracaoCreate extends Omit<Integracao, "id" | "createdAt" | "updatedAt"> {}
export interface IntegracaoUpdate extends Partial<IntegracaoCreate> {}
export interface IntegracaoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type IntegracaoStatus = "ativo" | "inativo" | "pendente";
