// V15-160: src/types/empresa.ts
export interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  cnae_principal?: string;
  natureza_juridica?: string;
  regime_tributario?: RegimeTributario;
  email?: string;
  telefone?: string;
  site?: string;
  endereco?: EnderecoEmpresa;
  responsavel_nome?: string;
  responsavel_cpf?: string;
  responsavel_email?: string;
  contador_nome?: string;
  contador_crc?: string;
  contador_email?: string;
  logo_url?: string;
  certificado_digital?: CertificadoDigital;
  config_esocial?: ConfigESocial;
  status: StatusEmpresa;
  created_at: string;
  updated_at: string;
}

export interface EnderecoEmpresa {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  codigo_municipio?: string;
}

export interface CertificadoDigital {
  tipo: 'A1' | 'A3';
  validade: string;
  arquivo?: string;
  senha?: string;
}

export interface ConfigESocial {
  ambiente: 'producao' | 'homologacao';
  processo_emissao: string;
  versao_processo: string;
}

export type RegimeTributario = 'simples_nacional' | 'lucro_presumido' | 'lucro_real';
export type StatusEmpresa = 'ativa' | 'inativa' | 'suspensa';

export interface EmpresaFormData extends Omit<Empresa, 'id' | 'created_at' | 'updated_at'> {}
