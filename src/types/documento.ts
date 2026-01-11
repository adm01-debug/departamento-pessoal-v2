// V15-437
export interface Documento { id: string; colaborador_id?: string; empresa_id?: string; nome: string; tipo: 'contrato' | 'atestado' | 'certificado' | 'comprovante' | 'outros'; arquivo_url: string; arquivo_nome: string; arquivo_tipo: string; arquivo_tamanho: number; validade?: string; observacoes?: string; created_at: string; }
export interface DocumentoUploadData { colaborador_id?: string; empresa_id?: string; nome: string; tipo: Documento['tipo']; arquivo: File; validade?: string; observacoes?: string; }
