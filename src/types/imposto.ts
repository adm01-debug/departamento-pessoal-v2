export interface Imposto {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ImpostoCreate extends Omit<Imposto, "id" | "createdAt" | "updatedAt"> {}
export interface ImpostoUpdate extends Partial<ImpostoCreate> {}
export interface ImpostoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ImpostoStatus = "ativo" | "inativo" | "pendente";
