/**
 * @fileoverview Tipos para integrações externas
 * @module types/integracao
 */

export type TipoIntegracao = 'bitrix24' | 'esocial' | 'contabil' | 'bancaria' | 'ponto' | 'beneficios';
export type StatusIntegracao = 'ativo' | 'inativo' | 'erro' | 'configurando';

export interface Integracao {
  id: string;
  tipo: TipoIntegracao;
  nome: string;
  status: StatusIntegracao;
  configuracao: Record<string, unknown>;
  ultimaSincronizacao?: string;
  erroMensagem?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogIntegracao {
  id: string;
  integracaoId: string;
  acao: string;
  status: 'sucesso' | 'erro';
  detalhes?: string;
  dataExecucao: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  eventos: string[];
  ativo: boolean;
}
