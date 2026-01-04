export interface Recibo {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface ReciboCreate extends Omit<Recibo, "id" | "createdAt" | "updatedAt"> {}
export interface ReciboUpdate extends Partial<ReciboCreate> {}
export interface ReciboFilter { search?: string; status?: string; page?: number; limit?: number; }
export type ReciboStatus = "ativo" | "inativo" | "pendente";
