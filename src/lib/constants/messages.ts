/** Mensagens de sucesso */
export const SUCCESS_MESSAGES = {
  CREATED: 'Registro criado com sucesso',
  UPDATED: 'Registro atualizado com sucesso',
  DELETED: 'Registro excluído com sucesso',
  SAVED: 'Alterações salvas com sucesso',
  SENT: 'Enviado com sucesso',
  APPROVED: 'Aprovado com sucesso',
  REJECTED: 'Rejeitado com sucesso',
} as const;

/** Mensagens de erro */
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  NOT_FOUND: 'Registro não encontrado',
  UNAUTHORIZED: 'Você não tem permissão para esta ação',
  VALIDATION: 'Verifique os dados informados',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  SERVER: 'Erro no servidor. Tente novamente mais tarde.',
  REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
} as const;

/** Mensagens de confirmação */
export const CONFIRM_MESSAGES = {
  DELETE: 'Tem certeza que deseja excluir este registro?',
  CANCEL: 'Tem certeza que deseja cancelar? As alterações serão perdidas.',
  LOGOUT: 'Tem certeza que deseja sair?',
} as const;
