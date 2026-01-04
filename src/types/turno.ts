export interface Turno {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface TurnoCreate extends Omit<Turno, "id" | "createdAt" | "updatedAt"> {}
export interface TurnoUpdate extends Partial<TurnoCreate> {}
export interface TurnoFilter { search?: string; status?: string; page?: number; limit?: number; }
export type TurnoStatus = "ativo" | "inativo" | "pendente";
