export interface Admissao {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface AdmissaoCreate extends Omit<Admissao, "id" | "createdAt" | "updatedAt"> {}
export interface AdmissaoUpdate extends Partial<AdmissaoCreate> {}
export interface AdmissaoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type AdmissaoStatus = "ativo" | "inativo" | "pendente";
