export interface Configuracao {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ConfiguracaoCreate extends Omit<Configuracao, "id" | "createdAt" | "updatedAt"> {}
export interface ConfiguracaoUpdate extends Partial<ConfiguracaoCreate> {}
export interface ConfiguracaoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ConfiguracaoStatus = "ativo" | "inativo" | "pendente";
