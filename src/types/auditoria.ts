export interface AuditLog {
  id: string;
  usuario_id: string;
  usuario_nome?: string;
  acao: 'criar' | 'editar' | 'excluir' | 'visualizar' | 'exportar' | 'login' | 'logout';
  entidade: string;
  entidade_id?: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  empresa_id?: string;
}

export interface AuditFilters {
  usuario_id?: string;
  acao?: AuditLog['acao'];
  entidade?: string;
  entidade_id?: string;
  data_inicio?: string;
  data_fim?: string;
  empresa_id?: string;
}

export interface AuditStats {
  total_acoes: number;
  por_acao: Record<string, number>;
  por_usuario: Record<string, number>;
  por_entidade: Record<string, number>;
}
