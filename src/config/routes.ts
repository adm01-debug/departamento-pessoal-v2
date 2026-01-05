export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  COLABORADORES: {
    LIST: "/colaboradores",
    NEW: "/colaboradores/novo",
    DETAIL: "/colaboradores/:id",
    EDIT: "/colaboradores/:id/editar",
  },
  FOLHA: {
    LIST: "/folha",
    CALCULAR: "/folha/calcular",
    DETAIL: "/folha/:competencia",
  },
  FERIAS: {
    LIST: "/ferias",
    PROGRAMAR: "/ferias/programar",
    DETAIL: "/ferias/:id",
  },
  PONTO: {
    LIST: "/ponto",
    ESPELHO: "/ponto/espelho",
    INCONSISTENCIAS: "/ponto/inconsistencias",
  },
  BENEFICIOS: {
    LIST: "/beneficios",
    NEW: "/beneficios/novo",
  },
  ESOCIAL: {
    LIST: "/esocial",
    EVENTOS: "/esocial/eventos",
    LOTE: "/esocial/lote",
  },
  RELATORIOS: {
    LIST: "/relatorios",
    GERAR: "/relatorios/gerar",
  },
  CARGOS: "/cargos",
  DEPARTAMENTOS: "/departamentos",
  CONFIGURACOES: "/configuracoes",
  ANALYTICS: "/analytics",
  EMPRESTIMOS: "/emprestimos",
  TREINAMENTOS: "/treinamentos",
  ASOS: "/asos",
  RUBRICAS: "/rubricas",
};

export default ROUTES;
