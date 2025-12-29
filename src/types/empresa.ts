/**
 * @fileoverview Tipos para gestão de empresas
 * @module types/empresa
 * @version V8.2 - QA Fix - Sincronizado com hooks
 */

// ============================================
// TIPOS BASE
// ============================================

export type RegimeTributario = 'simples' | 'lucro_presumido' | 'lucro_real';
export type PorteEmpresa = 'mei' | 'me' | 'epp' | 'medio' | 'grande';
export type TipoConta = 'corrente' | 'poupanca';

// ============================================
// INTERFACE PRINCIPAL
// ============================================

/**
 * Empresa do sistema
 */
export interface Empresa {
  id: string;
  
  // Dados básicos
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string | null;
  inscricao_estadual: string | null;
  inscricao_municipal: string | null;
  
  // Endereço
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  
  // Contato
  telefone: string | null;
  email: string | null;
  website?: string | null;
  
  // Logo
  logo_url: string | null;
  
  // Dados bancários
  banco?: string | null;
  agencia?: string | null;
  conta?: string | null;
  tipo_conta?: TipoConta | null;
  pix?: string | null;
  
  // Configurações
  regime_tributario?: RegimeTributario | null;
  porte?: PorteEmpresa | null;
  cnae_principal?: string | null;
  
  // Status
  ativa: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================
// FORMULÁRIOS
// ============================================

/**
 * Dados para criação de empresa
 */
export interface EmpresaFormData {
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  inscricao_estadual?: string | null;
  inscricao_municipal?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  telefone?: string | null;
  email?: string | null;
  website?: string | null;
  logo_url?: string | null;
  banco?: string | null;
  agencia?: string | null;
  conta?: string | null;
  tipo_conta?: TipoConta | null;
  pix?: string | null;
  regime_tributario?: RegimeTributario | null;
  porte?: PorteEmpresa | null;
  cnae_principal?: string | null;
  ativa?: boolean;
}

// ============================================
// FILTROS
// ============================================

/**
 * Filtros para listagem de empresas
 */
export interface EmpresaFilters {
  search?: string;
  uf?: string;
  cidade?: string;
  ativa?: boolean;
  regime_tributario?: RegimeTributario;
  porte?: PorteEmpresa;
}

// ============================================
// RELAÇÕES
// ============================================

/**
 * Associação usuário-empresa
 */
export interface UserEmpresa {
  id: string;
  user_id: string;
  empresa_id: string;
  is_default: boolean;
  role?: 'admin' | 'gerente' | 'usuario';
  created_at: string;
  empresa?: Empresa;
}

// ============================================
// CONFIGURAÇÕES
// ============================================

/**
 * Configurações da empresa
 */
export interface EmpresaConfiguracao {
  empresa_id: string;
  
  // Folha de pagamento
  dia_pagamento?: number;
  dia_adiantamento?: number;
  percentual_adiantamento?: number;
  
  // Ponto
  tolerancia_ponto_minutos?: number;
  intervalo_minimo_minutos?: number;
  
  // Férias
  antecedencia_ferias_dias?: number;
  
  // Geral
  timezone?: string;
  locale?: string;
  
  created_at?: string;
  updated_at?: string;
}

// ============================================
// LABELS
// ============================================

export const regimeTributarioLabels: Record<RegimeTributario, string> = {
  simples: 'Simples Nacional',
  lucro_presumido: 'Lucro Presumido',
  lucro_real: 'Lucro Real',
};

export const porteEmpresaLabels: Record<PorteEmpresa, string> = {
  mei: 'MEI',
  me: 'Microempresa (ME)',
  epp: 'Empresa de Pequeno Porte (EPP)',
  medio: 'Médio Porte',
  grande: 'Grande Porte',
};
