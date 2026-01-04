export interface Holerite {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface HoleriteCreate extends Omit<Holerite, "id" | "createdAt" | "updatedAt"> {}
export interface HoleriteUpdate extends Partial<HoleriteCreate> {}
export interface HoleriteFilter { search?: string; status?: string; page?: number; limit?: number; }
export type HoleriteStatus = "ativo" | "inativo" | "pendente";
