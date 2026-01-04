export interface Usuario {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
export interface UsuarioCreate extends Omit<Usuario, "id" | "createdAt" | "updatedAt"> {}
export interface UsuarioUpdate extends Partial<Omit<Usuario, "id" | "createdAt">> {}
export interface UsuarioFilter { search?: string; ativo?: boolean; page?: number; limit?: number; }
export interface UsuarioListResponse { data: Usuario[]; total: number; page: number; limit: number; }
export type UsuarioStatus = "ativo" | "inativo" | "pendente" | "cancelado";
