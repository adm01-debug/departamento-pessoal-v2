export interface PlanoSaude {
  id: string;
  nome?: string;
  descricao?: string;
  status?: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
}
export interface PlanoSaudeCreate extends Omit<PlanoSaude, "id" | "createdAt" | "updatedAt"> {}
export interface PlanoSaudeUpdate extends Partial<PlanoSaudeCreate> {}
export interface PlanoSaudeFilter { id?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc"; }
export interface PlanoSaudeListResponse { data: PlanoSaude[]; total: number; page: number; limit: number; }
export type PlanoSaudeStatus = "ativo" | "inativo" | "pendente";
export default PlanoSaude;
