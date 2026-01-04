export interface Relatorio {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface RelatorioCreate extends Omit<Relatorio, "id" | "createdAt" | "updatedAt"> {}
export interface RelatorioUpdate extends Partial<RelatorioCreate> {}
export interface RelatorioFilter { search?: string; status?: string; page?: number; limit?: number; }
export type RelatorioStatus = "ativo" | "inativo" | "pendente";
