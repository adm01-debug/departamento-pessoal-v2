// V16-007: Supabase Database Types - Auto-generated
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string;
          razao_social: string;
          nome_fantasia: string | null;
          cnpj: string;
          inscricao_estadual: string | null;
          email: string | null;
          telefone: string | null;
          cep: string | null;
          logradouro: string | null;
          numero: string | null;
          complemento: string | null;
          bairro: string | null;
          cidade: string | null;
          uf: string | null;
          regime_tributario: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['empresas']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['empresas']['Insert']>;
      };
      colaboradores: {
        Row: {
          id: string;
          empresa_id: string;
          matricula: string | null;
          nome: string;
          cpf: string;
          email: string | null;
          telefone: string | null;
          data_nascimento: string;
          data_admissao: string;
          data_demissao: string | null;
          salario: number;
          cargo_id: string | null;
          departamento_id: string | null;
          tipo_contrato: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['colaboradores']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['colaboradores']['Insert']>;
      };
      departamentos: {
        Row: {
          id: string;
          empresa_id: string;
          nome: string;
          descricao: string | null;
          codigo: string | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['departamentos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['departamentos']['Insert']>;
      };
      cargos: {
        Row: {
          id: string;
          empresa_id: string;
          nome: string;
          descricao: string | null;
          cbo: string | null;
          salario_base: number | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cargos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['cargos']['Insert']>;
      };
      folha_pagamento: {
        Row: {
          id: string;
          empresa_id: string;
          competencia: string;
          tipo: string;
          total_proventos: number;
          total_descontos: number;
          total_liquido: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['folha_pagamento']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['folha_pagamento']['Insert']>;
      };
      ferias: {
        Row: {
          id: string;
          colaborador_id: string;
          periodo_aquisitivo_inicio: string;
          periodo_aquisitivo_fim: string;
          periodo_gozo_inicio: string | null;
          periodo_gozo_fim: string | null;
          dias_gozo: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ferias']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ferias']['Insert']>;
      };
      ponto_registros: {
        Row: {
          id: string;
          colaborador_id: string;
          data: string;
          entrada_1: string | null;
          saida_1: string | null;
          entrada_2: string | null;
          saida_2: string | null;
          tipo: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ponto_registros']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ponto_registros']['Insert']>;
      };
      beneficios: {
        Row: {
          id: string;
          empresa_id: string;
          nome: string;
          tipo: string;
          valor_padrao: number | null;
          ativo: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['beneficios']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['beneficios']['Insert']>;
      };
      auditoria: {
        Row: {
          id: string;
          empresa_id: string | null;
          usuario_id: string;
          acao: string;
          tabela: string | null;
          registro_id: string | null;
          dados_anteriores: Json | null;
          dados_novos: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['auditoria']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['auditoria']['Insert']>;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Empresa = Tables<'empresas'>;
export type Colaborador = Tables<'colaboradores'>;
export type Departamento = Tables<'departamentos'>;
export type Cargo = Tables<'cargos'>;
export type FolhaPagamento = Tables<'folha_pagamento'>;
export type Ferias = Tables<'ferias'>;
export type PontoRegistro = Tables<'ponto_registros'>;
export type Beneficio = Tables<'beneficios'>;
export type Auditoria = Tables<'auditoria'>;
