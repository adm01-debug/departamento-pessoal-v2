// V15-174: src/config/messages.ts
export const MESSAGES = {
  success: {
    create: 'Registro criado com sucesso!',
    update: 'Registro atualizado com sucesso!',
    delete: 'Registro excluído com sucesso!',
    save: 'Dados salvos com sucesso!',
    send: 'Enviado com sucesso!',
    upload: 'Arquivo enviado com sucesso!',
    download: 'Download iniciado!',
    copy: 'Copiado para área de transferência!',
  },
  
  error: {
    generic: 'Ocorreu um erro. Tente novamente.',
    network: 'Erro de conexão. Verifique sua internet.',
    notFound: 'Registro não encontrado.',
    unauthorized: 'Você não tem permissão para esta ação.',
    validation: 'Verifique os campos obrigatórios.',
    upload: 'Erro ao enviar arquivo.',
    timeout: 'Tempo de conexão esgotado.',
  },
  
  confirm: {
    delete: 'Tem certeza que deseja excluir este registro?',
    cancel: 'Tem certeza que deseja cancelar?',
    discard: 'Descartar alterações não salvas?',
    logout: 'Tem certeza que deseja sair?',
  },
  
  validation: {
    required: 'Campo obrigatório',
    email: 'Email inválido',
    cpf: 'CPF inválido',
    cnpj: 'CNPJ inválido',
    phone: 'Telefone inválido',
    cep: 'CEP inválido',
    minLength: (min: number) => `Mínimo ${min} caracteres`,
    maxLength: (max: number) => `Máximo ${max} caracteres`,
    min: (min: number) => `Valor mínimo: ${min}`,
    max: (max: number) => `Valor máximo: ${max}`,
  },
  
  loading: {
    default: 'Carregando...',
    saving: 'Salvando...',
    sending: 'Enviando...',
    processing: 'Processando...',
    uploading: 'Enviando arquivo...',
  },
  
  empty: {
    default: 'Nenhum registro encontrado',
    search: 'Nenhum resultado para sua busca',
    filter: 'Nenhum resultado com os filtros aplicados',
  },
} as const;
