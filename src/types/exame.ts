export interface Exame {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ExameCreate extends Omit<Exame, "id" | "createdAt" | "updatedAt"> {}
export interface ExameUpdate extends Partial<ExameCreate> {}
export interface ExameFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ExameStatus = "ativo" | "inativo" | "pendente";
