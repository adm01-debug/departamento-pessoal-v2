export interface Common {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface CommonCreate extends Omit<Common, "id" | "createdAt" | "updatedAt"> {}
export interface CommonUpdate extends Partial<CommonCreate> {}
export interface CommonFilter { search?: string; status?: string; page?: number; limit?: number; }
export type CommonStatus = "ativo" | "inativo" | "pendente";
