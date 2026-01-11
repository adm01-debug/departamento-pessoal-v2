// V15-169: src/types/documento.ts
export interface Documento {
  id: string;
  entidade_tipo: EntidadeTipo;
  entidade_id: string;
  tipo: TipoDocumento;
  nome: string;
  descricao?: string;
  arquivo_url: string;
  arquivo_nome: string;
  arquivo_tamanho: number;
  arquivo_tipo: string;
  data_documento?: string;
  data_validade?: string;
  numero?: string;
  observacoes?: string;
  privado: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type EntidadeTipo = 'colaborador' | 'empresa' | 'folha' | 'ferias' | 'afastamento' | 'rescisao';

export type TipoDocumento =
  | 'contrato'
  | 'aditivo'
  | 'atestado'
  | 'certificado'
  | 'comprovante'
  | 'declaracao'
  | 'holerite'
  | 'informe_rendimentos'
  | 'rais'
  | 'caged'
  | 'esocial'
  | 'rescisao'
  | 'ferias'
  | 'foto'
  | 'outros';

export interface DocumentoFormData {
  entidade_tipo: EntidadeTipo;
  entidade_id: string;
  tipo: TipoDocumento;
  nome: string;
  descricao?: string;
  arquivo: File;
  privado?: boolean;
}

export interface DocumentoFilters {
  entidade_tipo?: EntidadeTipo;
  tipo?: TipoDocumento;
  search?: string;
}
