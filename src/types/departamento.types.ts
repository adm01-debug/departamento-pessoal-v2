export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface DepartamentoCreate extends Omit<Departamento, "id" | "createdAt" | "updatedAt"> {}
export interface DepartamentoUpdate extends Partial<DepartamentoCreate> {}
export interface DepartamentoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type DepartamentoStatus = "ativo" | "inativo" | "pendente";
