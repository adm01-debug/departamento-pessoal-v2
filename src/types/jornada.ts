export interface Jornada {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface JornadaCreate extends Omit<Jornada, "id" | "createdAt" | "updatedAt"> {}
export interface JornadaUpdate extends Partial<JornadaCreate> {}
export interface JornadaFilter { search?: string; status?: string; page?: number; limit?: number; }
export type JornadaStatus = "ativo" | "inativo" | "pendente";
