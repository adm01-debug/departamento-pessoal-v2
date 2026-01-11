// V15-171: src/config/app.ts
export const APP_CONFIG = {
  name: 'Sistema Departamento Pessoal',
  version: '15.0.0',
  description: 'Sistema completo de gestão de departamento pessoal',
  author: 'Pink e Cerébro',
  
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    retries: 3,
  },
  
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
  },
  
  dates: {
    format: 'dd/MM/yyyy',
    formatTime: 'HH:mm',
    formatDateTime: 'dd/MM/yyyy HH:mm',
    locale: 'pt-BR',
  },
  
  currency: {
    locale: 'pt-BR',
    currency: 'BRL',
  },
  
  features: {
    esocial: true,
    ponto: true,
    biometria: false,
    faceRecognition: false,
    geolocation: true,
  },
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  colaboradores: '/colaboradores',
  empresas: '/empresas',
  folha: '/folha',
  ferias: '/ferias',
  ponto: '/ponto',
  beneficios: '/beneficios',
  relatorios: '/relatorios',
  configuracoes: '/configuracoes',
  esocial: '/esocial',
} as const;
