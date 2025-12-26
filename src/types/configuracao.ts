/**
 * @fileoverview Tipos para configurações do sistema
 * @module types/configuracao
 */

export interface ConfiguracaoEmpresa {
  id: string;
  empresaId: string;
  logoUrl?: string;
  corPrimaria: string;
  corSecundaria: string;
  timezone: string;
  idioma: string;
  moeda: string;
  formatoData: string;
}

export interface ConfiguracaoNotificacoes {
  emailAtivo: boolean;
  pushAtivo: boolean;
  smsAtivo: boolean;
  digestoDiario: boolean;
  alertasUrgentes: boolean;
}

export interface ConfiguracaoIntegracoes {
  bitrix24Ativo: boolean;
  bitrix24Webhook?: string;
  esocialAtivo: boolean;
  contabilAtivo: boolean;
}

export interface Configuracao {
  id: string;
  empresa: ConfiguracaoEmpresa;
  notificacoes: ConfiguracaoNotificacoes;
  integracoes: ConfiguracaoIntegracoes;
  updatedAt: string;
  updatedBy: string;
}
