export interface Usuario {
  id: string;
  nome: string;
  descricao?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface UsuarioCreate extends Omit<Usuario, "id" | "createdAt" | "updatedAt"> {}
export interface UsuarioUpdate extends Partial<UsuarioCreate> {}
export interface UsuarioFilter { search?: string; status?: string; page?: number; limit?: number; }
export type UsuarioStatus = "ativo" | "inativo" | "pendente";
