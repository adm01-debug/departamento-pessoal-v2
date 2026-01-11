// V15-432
export interface Empresa { id: string; razao_social: string; nome_fantasia?: string; cnpj: string; inscricao_estadual?: string; email?: string; telefone?: string; cep?: string; logradouro?: string; numero?: string; complemento?: string; bairro?: string; cidade?: string; uf?: string; regime_tributario?: 'simples_nacional' | 'lucro_presumido' | 'lucro_real'; status: 'ativa' | 'inativa' | 'suspensa'; logo_url?: string; created_at: string; updated_at: string; }
export interface EmpresaFormData extends Omit<Empresa, 'id' | 'created_at' | 'updated_at'> {}
