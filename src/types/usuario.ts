export interface Usuario {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  telefone?: string;
  cargo?: string;
  departamento_id?: string;
  empresa_id?: string;
  
  // Permissões
  role: 'admin' | 'gestor' | 'rh' | 'colaborador' | 'viewer';
  permissions?: string[];
  
  // Status
  ativo: boolean;
  email_verificado?: boolean;
  ultimo_acesso?: string;
  
  // Metadados
  created_at: string;
  updated_at?: string;
}

export interface UsuarioFormData extends Omit<Usuario, 'id' | 'created_at' | 'updated_at' | 'ultimo_acesso'> {}

export interface UsuarioFilters {
  search?: string;
  role?: Usuario['role'];
  ativo?: boolean;
  departamento_id?: string;
  empresa_id?: string;
}

export interface Session {
  user: Usuario;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

