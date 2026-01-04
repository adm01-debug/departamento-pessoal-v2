export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface CargoCreate extends Omit<Cargo, "id" | "createdAt" | "updatedAt"> {}
export interface CargoUpdate extends Partial<CargoCreate> {}
export interface CargoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type CargoStatus = "ativo" | "inativo" | "pendente";
