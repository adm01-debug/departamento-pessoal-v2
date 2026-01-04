export interface Guia {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface GuiaCreate extends Omit<Guia, "id" | "createdAt" | "updatedAt"> {}
export interface GuiaUpdate extends Partial<GuiaCreate> {}
export interface GuiaFilter { search?: string; status?: string; page?: number; limit?: number; }
export type GuiaStatus = "ativo" | "inativo" | "pendente";
