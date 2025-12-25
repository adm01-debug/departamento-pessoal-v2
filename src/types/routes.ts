/** Rotas da aplicação */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  COLABORADORES: '/colaboradores',
  FERIAS: '/ferias',
  FOLHA: '/folha',
  ADMISSAO: '/admissao',
  BENEFICIOS: '/beneficios',
  AFASTAMENTOS: '/afastamentos',
  PONTO: '/ponto',
  ESOCIAL: '/esocial',
  RELATORIOS: '/relatorios',
  DOCUMENTOS: '/documentos',
  AUDITORIA: '/auditoria',
  CONFIGURACOES: '/configuracoes',
  USUARIOS: '/usuarios',
  CARGOS: '/cargos',
  DEPARTAMENTOS: '/departamentos',
  FERIADOS: '/feriados',
  PERFIL: '/perfil',
  ASSINATURAS: '/assinaturas',
  LOGIN: '/login',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
