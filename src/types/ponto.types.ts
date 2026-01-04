export interface Ponto {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface PontoCreate extends Omit<Ponto, "id" | "createdAt" | "updatedAt"> {}
export interface PontoUpdate extends Partial<PontoCreate> {}
export interface PontoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type PontoStatus = "ativo" | "inativo" | "pendente";
