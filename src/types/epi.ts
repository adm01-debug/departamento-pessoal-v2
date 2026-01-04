export interface Epi {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface EpiCreate extends Omit<Epi, "id" | "createdAt" | "updatedAt"> {}
export interface EpiUpdate extends Partial<EpiCreate> {}
export interface EpiFilter { search?: string; status?: string; page?: number; limit?: number; }
export type EpiStatus = "ativo" | "inativo" | "pendente";
