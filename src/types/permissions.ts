/** Permissões do sistema */
export type Permission = 
  // Colaboradores
  | 'colaboradores:read' | 'colaboradores:write' | 'colaboradores:delete' | 'colaboradores:export'
  // Férias
  | 'ferias:read' | 'ferias:write' | 'ferias:approve' | 'ferias:cancel'
  // Folha
  | 'folha:read' | 'folha:write' | 'folha:process' | 'folha:close' | 'folha:reopen'
  // Benefícios
  | 'beneficios:read' | 'beneficios:write'
  // Ponto
  | 'ponto:read' | 'ponto:write' | 'ponto:approve' | 'ponto:close'
  // Admissões
  | 'admissao:read' | 'admissao:write' | 'admissao:approve'
  // Desligamentos
  | 'desligamento:read' | 'desligamento:write' | 'desligamento:approve'
  // Relatórios
  | 'relatorios:read' | 'relatorios:export' | 'relatorios:schedule'
  // Configurações
  | 'configuracoes:read' | 'configuracoes:write'
  // Usuários
  | 'usuarios:read' | 'usuarios:write' | 'usuarios:delete' | 'usuarios:permissions'
  // Auditoria
  | 'auditoria:read' | 'auditoria:export'
  // Segurança
  | 'seguranca:read' | 'seguranca:manage';

/** Roles do sistema */
export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';

/** Detalhes de uma permissão */
export interface PermissionDetails {
  code: Permission;
  name: string;
  description: string;
  module: string;
}

/** Todas as permissões com detalhes */
export const ALL_PERMISSIONS: PermissionDetails[] = [
  // Colaboradores
  { code: 'colaboradores:read', name: 'Visualizar Colaboradores', description: 'Permite visualizar lista de colaboradores', module: 'colaboradores' },
  { code: 'colaboradores:write', name: 'Editar Colaboradores', description: 'Permite cadastrar e editar colaboradores', module: 'colaboradores' },
  { code: 'colaboradores:delete', name: 'Excluir Colaboradores', description: 'Permite excluir colaboradores', module: 'colaboradores' },
  { code: 'colaboradores:export', name: 'Exportar Colaboradores', description: 'Permite exportar dados de colaboradores', module: 'colaboradores' },
  
  // Férias
  { code: 'ferias:read', name: 'Visualizar Férias', description: 'Permite visualizar programação de férias', module: 'ferias' },
  { code: 'ferias:write', name: 'Programar Férias', description: 'Permite programar férias', module: 'ferias' },
  { code: 'ferias:approve', name: 'Aprovar Férias', description: 'Permite aprovar solicitações de férias', module: 'ferias' },
  { code: 'ferias:cancel', name: 'Cancelar Férias', description: 'Permite cancelar férias programadas', module: 'ferias' },
  
  // Folha
  { code: 'folha:read', name: 'Visualizar Folha', description: 'Permite visualizar folhas de pagamento', module: 'folha' },
  { code: 'folha:write', name: 'Editar Folha', description: 'Permite editar folhas abertas', module: 'folha' },
  { code: 'folha:process', name: 'Processar Folha', description: 'Permite processar cálculos da folha', module: 'folha' },
  { code: 'folha:close', name: 'Fechar Folha', description: 'Permite fechar folhas de pagamento', module: 'folha' },
  { code: 'folha:reopen', name: 'Reabrir Folha', description: 'Permite reabrir folhas fechadas', module: 'folha' },
  
  // Benefícios
  { code: 'beneficios:read', name: 'Visualizar Benefícios', description: 'Permite visualizar benefícios', module: 'beneficios' },
  { code: 'beneficios:write', name: 'Gerenciar Benefícios', description: 'Permite cadastrar e editar benefícios', module: 'beneficios' },
  
  // Ponto
  { code: 'ponto:read', name: 'Visualizar Ponto', description: 'Permite visualizar registros de ponto', module: 'ponto' },
  { code: 'ponto:write', name: 'Editar Ponto', description: 'Permite ajustar registros de ponto', module: 'ponto' },
  { code: 'ponto:approve', name: 'Aprovar Ajustes', description: 'Permite aprovar ajustes de ponto', module: 'ponto' },
  { code: 'ponto:close', name: 'Fechar Período', description: 'Permite fechar períodos de ponto', module: 'ponto' },
  
  // Admissões
  { code: 'admissao:read', name: 'Visualizar Admissões', description: 'Permite visualizar processos de admissão', module: 'admissao' },
  { code: 'admissao:write', name: 'Gerenciar Admissões', description: 'Permite iniciar e editar admissões', module: 'admissao' },
  { code: 'admissao:approve', name: 'Aprovar Admissão', description: 'Permite aprovar admissões', module: 'admissao' },
  
  // Desligamentos
  { code: 'desligamento:read', name: 'Visualizar Desligamentos', description: 'Permite visualizar desligamentos', module: 'desligamento' },
  { code: 'desligamento:write', name: 'Gerenciar Desligamentos', description: 'Permite iniciar e editar desligamentos', module: 'desligamento' },
  { code: 'desligamento:approve', name: 'Aprovar Desligamento', description: 'Permite aprovar desligamentos', module: 'desligamento' },
  
  // Relatórios
  { code: 'relatorios:read', name: 'Visualizar Relatórios', description: 'Permite acessar relatórios', module: 'relatorios' },
  { code: 'relatorios:export', name: 'Exportar Relatórios', description: 'Permite exportar relatórios', module: 'relatorios' },
  { code: 'relatorios:schedule', name: 'Agendar Relatórios', description: 'Permite agendar envio de relatórios', module: 'relatorios' },
  
  // Configurações
  { code: 'configuracoes:read', name: 'Visualizar Configurações', description: 'Permite visualizar configurações', module: 'configuracoes' },
  { code: 'configuracoes:write', name: 'Editar Configurações', description: 'Permite alterar configurações', module: 'configuracoes' },
  
  // Usuários
  { code: 'usuarios:read', name: 'Visualizar Usuários', description: 'Permite visualizar usuários do sistema', module: 'usuarios' },
  { code: 'usuarios:write', name: 'Gerenciar Usuários', description: 'Permite criar e editar usuários', module: 'usuarios' },
  { code: 'usuarios:delete', name: 'Excluir Usuários', description: 'Permite excluir usuários', module: 'usuarios' },
  { code: 'usuarios:permissions', name: 'Gerenciar Permissões', description: 'Permite gerenciar permissões de usuários', module: 'usuarios' },
  
  // Auditoria
  { code: 'auditoria:read', name: 'Visualizar Auditoria', description: 'Permite visualizar logs de auditoria', module: 'auditoria' },
  { code: 'auditoria:export', name: 'Exportar Auditoria', description: 'Permite exportar logs de auditoria', module: 'auditoria' },
  
  // Segurança
  { code: 'seguranca:read', name: 'Visualizar Segurança', description: 'Permite visualizar configurações de segurança', module: 'seguranca' },
  { code: 'seguranca:manage', name: 'Gerenciar Segurança', description: 'Permite gerenciar configurações de segurança', module: 'seguranca' },
];

/** Mapeamento role -> permissions */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL_PERMISSIONS.map(p => p.code),
  manager: [
    'colaboradores:read', 'colaboradores:write', 'colaboradores:export',
    'ferias:read', 'ferias:write', 'ferias:approve',
    'folha:read', 'folha:write',
    'beneficios:read', 'beneficios:write',
    'ponto:read', 'ponto:write', 'ponto:approve',
    'admissao:read', 'admissao:write',
    'desligamento:read', 'desligamento:write',
    'relatorios:read', 'relatorios:export',
    'auditoria:read'
  ],
  analyst: [
    'colaboradores:read',
    'ferias:read',
    'folha:read',
    'beneficios:read',
    'ponto:read',
    'admissao:read',
    'desligamento:read',
    'relatorios:read', 'relatorios:export'
  ],
  viewer: [
    'colaboradores:read',
    'ferias:read',
    'folha:read',
    'ponto:read'
  ],
};

/** Obter módulos únicos */
export const MODULES = [...new Set(ALL_PERMISSIONS.map(p => p.module))];

/** Labels dos módulos */
export const MODULE_LABELS: Record<string, string> = {
  colaboradores: 'Colaboradores',
  ferias: 'Férias',
  folha: 'Folha de Pagamento',
  beneficios: 'Benefícios',
  ponto: 'Ponto',
  admissao: 'Admissões',
  desligamento: 'Desligamentos',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  usuarios: 'Usuários',
  auditoria: 'Auditoria',
  seguranca: 'Segurança'
};
