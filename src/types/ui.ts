export interface Ui {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface UiCreate extends Omit<Ui, "id" | "createdAt" | "updatedAt"> {}
export interface UiUpdate extends Partial<UiCreate> {}
export interface UiFilter { search?: string; status?: string; page?: number; limit?: number; }
export type UiStatus = "ativo" | "inativo" | "pendente";
