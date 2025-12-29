/**
 * @fileoverview Constantes centralizadas do sistema
 * @module constants
 * @version V8.1 - Criado por análise QA
 */

// ============================================
// TRABALHISTAS 2025
// ============================================

export const TRABALHISTAS = {
  /** Salário mínimo federal 2025 */
  SALARIO_MINIMO: 1518.00,
  
  /** Teto do INSS 2025 */
  TETO_INSS: 8157.41,
  
  /** Dedução por dependente IRRF */
  DEDUCAO_DEPENDENTE_IRRF: 189.59,
  
  /** Alíquota FGTS */
  ALIQUOTA_FGTS: 0.08,
  
  /** Alíquota INSS Patronal */
  ALIQUOTA_INSS_PATRONAL: 0.20,
  
  /** Jornada mensal padrão (44h/semana) */
  JORNADA_MENSAL_PADRAO: 220,
  
  /** Adicional noturno mínimo legal */
  ADICIONAL_NOTURNO_MINIMO: 0.20,
  
  /** Adicional periculosidade */
  ADICIONAL_PERICULOSIDADE: 0.30,
  
  /** Valor salário família 2025 (até R$ 1.819,26) */
  SALARIO_FAMILIA_LIMITE: 1819.26,
  SALARIO_FAMILIA_VALOR: 62.04,
} as const;

// ============================================
// TABELA INSS 2025
// ============================================

export const TABELA_INSS_2025 = [
  { faixa: 1, valorInicial: 0, valorFinal: 1518.00, aliquota: 0.075 },
  { faixa: 2, valorInicial: 1518.01, valorFinal: 2793.88, aliquota: 0.09 },
  { faixa: 3, valorInicial: 2793.89, valorFinal: 4190.83, aliquota: 0.12 },
  { faixa: 4, valorInicial: 4190.84, valorFinal: 8157.41, aliquota: 0.14 },
] as const;

// ============================================
// TABELA IRRF 2025
// ============================================

export const TABELA_IRRF_2025 = [
  { faixa: 1, valorInicial: 0, valorFinal: 2259.20, aliquota: 0, deducao: 0 },
  { faixa: 2, valorInicial: 2259.21, valorFinal: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { faixa: 3, valorInicial: 2826.66, valorFinal: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { faixa: 4, valorInicial: 3751.06, valorFinal: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { faixa: 5, valorInicial: 4664.69, valorFinal: Infinity, aliquota: 0.275, deducao: 896.00 },
] as const;

// ============================================
// TIPOS DE RESCISÃO
// ============================================

export const TIPOS_RESCISAO = {
  SEM_JUSTA_CAUSA: 'sem_justa_causa',
  COM_JUSTA_CAUSA: 'com_justa_causa',
  PEDIDO_DEMISSAO: 'pedido_demissao',
  ACORDO_MUTUO: 'acordo_mutuo',
  CULPA_RECIPROCA: 'culpa_reciproca',
  FIM_CONTRATO: 'fim_contrato',
  FALECIMENTO: 'falecimento',
} as const;

export const TIPOS_RESCISAO_LABELS: Record<string, string> = {
  sem_justa_causa: 'Sem Justa Causa',
  com_justa_causa: 'Com Justa Causa',
  pedido_demissao: 'Pedido de Demissão',
  acordo_mutuo: 'Acordo Mútuo (Art. 484-A)',
  culpa_reciproca: 'Culpa Recíproca',
  fim_contrato: 'Fim de Contrato',
  falecimento: 'Falecimento',
};

// ============================================
// DIREITOS POR TIPO DE RESCISÃO
// ============================================

export const DIREITOS_RESCISAO = {
  sem_justa_causa: {
    saldoSalario: true,
    avisoPrevio: true,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFGTS: 40,
    saqueFGTS: 100,
    seguroDesemprego: true,
  },
  com_justa_causa: {
    saldoSalario: true,
    avisoPrevio: false,
    feriasVencidas: true,
    feriasProporcionais: false,
    decimoTerceiro: false,
    multaFGTS: 0,
    saqueFGTS: 0,
    seguroDesemprego: false,
  },
  pedido_demissao: {
    saldoSalario: true,
    avisoPrevio: true, // pode ser descontado se não trabalhado
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFGTS: 0,
    saqueFGTS: 0,
    seguroDesemprego: false,
  },
  acordo_mutuo: {
    saldoSalario: true,
    avisoPrevio: true, // 50%
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFGTS: 20,
    saqueFGTS: 80,
    seguroDesemprego: false,
  },
} as const;

// ============================================
// STATUS
// ============================================

export const STATUS_COLABORADOR = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  FERIAS: 'ferias',
  AFASTADO: 'afastado',
  DESLIGADO: 'desligado',
  PENDENTE: 'pendente',
} as const;

export const STATUS_FOLHA = {
  ABERTA: 'aberta',
  CALCULANDO: 'calculando',
  CALCULADA: 'calculada',
  CONFERIDA: 'conferida',
  FECHADA: 'fechada',
  PAGA: 'paga',
} as const;

export const STATUS_HOLERITE = {
  RASCUNHO: 'rascunho',
  CALCULADO: 'calculado',
  CONFERIDO: 'conferido',
  APROVADO: 'aprovado',
  PAGO: 'pago',
} as const;

export const STATUS_FERIAS = {
  SOLICITADA: 'solicitada',
  APROVADA: 'aprovada',
  REJEITADA: 'rejeitada',
  PROGRAMADA: 'programada',
  EM_GOZO: 'em_gozo',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
} as const;

// ============================================
// TIPO DE CONTRATO
// ============================================

export const TIPOS_CONTRATO = {
  CLT: 'clt',
  PJ: 'pj',
  ESTAGIARIO: 'estagiario',
  TEMPORARIO: 'temporario',
  INTERMITENTE: 'intermitente',
  APRENDIZ: 'aprendiz',
  AUTONOMO: 'autonomo',
} as const;

export const TIPOS_CONTRATO_LABELS: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ - Pessoa Jurídica',
  estagiario: 'Estagiário',
  temporario: 'Temporário',
  intermitente: 'Intermitente',
  aprendiz: 'Jovem Aprendiz',
  autonomo: 'Autônomo',
};

// ============================================
// GRAUS DE INSALUBRIDADE
// ============================================

export const GRAUS_INSALUBRIDADE = {
  MINIMO: { grau: 'minimo', percentual: 0.10, label: 'Mínimo (10%)' },
  MEDIO: { grau: 'medio', percentual: 0.20, label: 'Médio (20%)' },
  MAXIMO: { grau: 'maximo', percentual: 0.40, label: 'Máximo (40%)' },
} as const;

// ============================================
// BANCOS
// ============================================

export const BANCOS_COMUNS = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú' },
  { codigo: '077', nome: 'Banco Inter' },
  { codigo: '260', nome: 'Nubank' },
  { codigo: '336', nome: 'C6 Bank' },
  { codigo: '212', nome: 'Banco Original' },
  { codigo: '756', nome: 'Sicoob' },
  { codigo: '748', nome: 'Sicredi' },
  { codigo: '422', nome: 'Safra' },
  { codigo: '070', nome: 'BRB' },
  { codigo: '197', nome: 'Stone' },
  { codigo: '380', nome: 'PicPay' },
  { codigo: '323', nome: 'Mercado Pago' },
] as const;

// ============================================
// ESTADOS BRASILEIROS
// ============================================

export const UF_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// ============================================
// REGEX DE VALIDAÇÃO
// ============================================

export const REGEX = {
  CPF: /^\d{11}$/,
  CPF_FORMATADO: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{14}$/,
  CNPJ_FORMATADO: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONE: /^\d{10,11}$/,
  CEP: /^\d{8}$/,
  PIS: /^\d{11}$/,
  DATA_ISO: /^\d{4}-\d{2}-\d{2}$/,
  COMPETENCIA: /^\d{4}-\d{2}$/,
} as const;

// ============================================
// PAGINAÇÃO
// ============================================

export const PAGINACAO = {
  ITENS_POR_PAGINA_PADRAO: 10,
  ITENS_POR_PAGINA_OPCOES: [10, 25, 50, 100],
  MAX_PAGINAS_VISIVEIS: 5,
} as const;

// ============================================
// CACHE
// ============================================

export const CACHE_TIME = {
  /** 5 minutos em ms */
  CURTO: 5 * 60 * 1000,
  /** 15 minutos em ms */
  MEDIO: 15 * 60 * 1000,
  /** 30 minutos em ms */
  LONGO: 30 * 60 * 1000,
  /** 1 hora em ms */
  MUITO_LONGO: 60 * 60 * 1000,
} as const;

// ============================================
// MENSAGENS
// ============================================

export const MENSAGENS = {
  ERRO: {
    GENERICO: 'Ocorreu um erro. Tente novamente.',
    REDE: 'Erro de conexão. Verifique sua internet.',
    NAO_AUTORIZADO: 'Você não tem permissão para esta ação.',
    NAO_ENCONTRADO: 'Registro não encontrado.',
    VALIDACAO: 'Verifique os dados informados.',
    SESSAO_EXPIRADA: 'Sua sessão expirou. Faça login novamente.',
  },
  SUCESSO: {
    SALVO: 'Registro salvo com sucesso!',
    ATUALIZADO: 'Registro atualizado com sucesso!',
    EXCLUIDO: 'Registro excluído com sucesso!',
    ENVIADO: 'Dados enviados com sucesso!',
  },
} as const;
