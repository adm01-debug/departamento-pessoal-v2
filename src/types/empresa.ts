/**
 * @fileoverview Tipos para gestão de empresas
 * @module types/empresa
 */

export interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  
  // Dados bancários
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: 'corrente' | 'poupanca';
  
  // Configurações
  regime_tributario?: 'simples' | 'lucro_presumido' | 'lucro_real';
  porte?: 'mei' | 'me' | 'epp' | 'medio' | 'grande';
  cnae_principal?: string;
  
  // Metadados
  created_at?: string;
  updated_at?: string;
  ativa?: boolean;
}

export interface EmpresaFormData extends Omit<Empresa, 'id' | 'created_at' | 'updated_at'> {}

export interface EmpresaFilters {
  search?: string;
  uf?: string;
  ativa?: boolean;
  regime_tributario?: Empresa['regime_tributario'];
}


