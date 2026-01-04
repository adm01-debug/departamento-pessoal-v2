export interface Seguro {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface SeguroCreate extends Omit<Seguro, "id" | "createdAt" | "updatedAt"> {}
export interface SeguroUpdate extends Partial<SeguroCreate> {}
export interface SeguroFilter { search?: string; status?: string; page?: number; limit?: number; }
export type SeguroStatus = "ativo" | "inativo" | "pendente";
