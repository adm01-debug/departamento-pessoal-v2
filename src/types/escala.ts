export interface Escala {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface EscalaCreate extends Omit<Escala, "id" | "createdAt" | "updatedAt"> {}
export interface EscalaUpdate extends Partial<EscalaCreate> {}
export interface EscalaFilter { search?: string; status?: string; page?: number; limit?: number; }
export type EscalaStatus = "ativo" | "inativo" | "pendente";
