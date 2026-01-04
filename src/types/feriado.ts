export interface Feriado {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface FeriadoCreate extends Omit<Feriado, "id" | "createdAt" | "updatedAt"> {}
export interface FeriadoUpdate extends Partial<FeriadoCreate> {}
export interface FeriadoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type FeriadoStatus = "ativo" | "inativo" | "pendente";
