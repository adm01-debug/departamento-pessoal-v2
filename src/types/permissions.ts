/** Permissões do sistema */
export type Permission = 
  | 'colaboradores:read' | 'colaboradores:write' | 'colaboradores:delete'
  | 'ferias:read' | 'ferias:write' | 'ferias:approve'
  | 'folha:read' | 'folha:write' | 'folha:process'
  | 'beneficios:read' | 'beneficios:write'
  | 'relatorios:read' | 'relatorios:export'
  | 'configuracoes:read' | 'configuracoes:write'
  | 'usuarios:read' | 'usuarios:write' | 'usuarios:delete'
  | 'auditoria:read';

/** Roles do sistema */
export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';

/** Mapeamento role -> permissions */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['colaboradores:read', 'colaboradores:write', 'colaboradores:delete', 'ferias:read', 'ferias:write', 'ferias:approve', 'folha:read', 'folha:write', 'folha:process', 'beneficios:read', 'beneficios:write', 'relatorios:read', 'relatorios:export', 'configuracoes:read', 'configuracoes:write', 'usuarios:read', 'usuarios:write', 'usuarios:delete', 'auditoria:read'],
  manager: ['colaboradores:read', 'colaboradores:write', 'ferias:read', 'ferias:write', 'ferias:approve', 'folha:read', 'beneficios:read', 'relatorios:read', 'relatorios:export', 'auditoria:read'],
  analyst: ['colaboradores:read', 'ferias:read', 'folha:read', 'beneficios:read', 'relatorios:read'],
  viewer: ['colaboradores:read', 'ferias:read', 'folha:read'],
};
