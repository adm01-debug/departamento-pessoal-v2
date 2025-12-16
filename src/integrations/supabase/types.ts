export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      colaboradores: {
        Row: {
          agencia: string | null
          bairro: string | null
          banco_codigo: string | null
          banco_nome: string | null
          cargo: string
          cbo: string | null
          celular: string | null
          centro_custo: string | null
          cep: string | null
          certificado_reservista: string | null
          cidade: string | null
          cnh_categoria: string | null
          cnh_numero: string | null
          cnh_validade: string | null
          complemento: string | null
          conta: string | null
          cpf: string
          created_at: string
          created_by: string | null
          ctps_data_emissao: string | null
          ctps_numero: string | null
          ctps_serie: string | null
          ctps_uf: string | null
          cursos_certificacoes: string | null
          data_admissao: string
          data_desligamento: string | null
          data_nascimento: string
          departamento: string
          email: string | null
          escolaridade: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil: Database["public"]["Enums"]["estado_civil"]
          formacao: string | null
          foto_url: string | null
          horario_entrada: string | null
          horario_saida: string | null
          id: string
          intervalo_minutos: number | null
          jornada_semanal: number | null
          local_trabalho: string | null
          logradouro: string | null
          matricula: string | null
          nacionalidade: string | null
          naturalidade_cidade: string | null
          naturalidade_uf: string | null
          nome_completo: string
          nome_mae: string
          nome_pai: string | null
          nome_social: string | null
          numero: string | null
          observacoes: string | null
          pis_pasep: string | null
          pix_chave: string | null
          pix_tipo: string | null
          rg: string | null
          rg_data_emissao: string | null
          rg_orgao_emissor: string | null
          rg_uf: string | null
          salario_base: number
          sexo: Database["public"]["Enums"]["sexo"]
          status: Database["public"]["Enums"]["status_colaborador"]
          telefone: string | null
          tipo_conta: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato: Database["public"]["Enums"]["tipo_contrato"]
          tipo_salario: string | null
          titulo_eleitor: string | null
          titulo_secao: string | null
          titulo_zona: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          cargo: string
          cbo?: string | null
          celular?: string | null
          centro_custo?: string | null
          cep?: string | null
          certificado_reservista?: string | null
          cidade?: string | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_validade?: string | null
          complemento?: string | null
          conta?: string | null
          cpf: string
          created_at?: string
          created_by?: string | null
          ctps_data_emissao?: string | null
          ctps_numero?: string | null
          ctps_serie?: string | null
          ctps_uf?: string | null
          cursos_certificacoes?: string | null
          data_admissao: string
          data_desligamento?: string | null
          data_nascimento: string
          departamento: string
          email?: string | null
          escolaridade?: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"]
          formacao?: string | null
          foto_url?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          jornada_semanal?: number | null
          local_trabalho?: string | null
          logradouro?: string | null
          matricula?: string | null
          nacionalidade?: string | null
          naturalidade_cidade?: string | null
          naturalidade_uf?: string | null
          nome_completo: string
          nome_mae: string
          nome_pai?: string | null
          nome_social?: string | null
          numero?: string | null
          observacoes?: string | null
          pis_pasep?: string | null
          pix_chave?: string | null
          pix_tipo?: string | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          rg_uf?: string | null
          salario_base: number
          sexo: Database["public"]["Enums"]["sexo"]
          status?: Database["public"]["Enums"]["status_colaborador"]
          telefone?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato?: Database["public"]["Enums"]["tipo_contrato"]
          tipo_salario?: string | null
          titulo_eleitor?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          cargo?: string
          cbo?: string | null
          celular?: string | null
          centro_custo?: string | null
          cep?: string | null
          certificado_reservista?: string | null
          cidade?: string | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_validade?: string | null
          complemento?: string | null
          conta?: string | null
          cpf?: string
          created_at?: string
          created_by?: string | null
          ctps_data_emissao?: string | null
          ctps_numero?: string | null
          ctps_serie?: string | null
          ctps_uf?: string | null
          cursos_certificacoes?: string | null
          data_admissao?: string
          data_desligamento?: string | null
          data_nascimento?: string
          departamento?: string
          email?: string | null
          escolaridade?: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"]
          formacao?: string | null
          foto_url?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          jornada_semanal?: number | null
          local_trabalho?: string | null
          logradouro?: string | null
          matricula?: string | null
          nacionalidade?: string | null
          naturalidade_cidade?: string | null
          naturalidade_uf?: string | null
          nome_completo?: string
          nome_mae?: string
          nome_pai?: string | null
          nome_social?: string | null
          numero?: string | null
          observacoes?: string | null
          pis_pasep?: string | null
          pix_chave?: string | null
          pix_tipo?: string | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          rg_uf?: string | null
          salario_base?: number
          sexo?: Database["public"]["Enums"]["sexo"]
          status?: Database["public"]["Enums"]["status_colaborador"]
          telefone?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato?: Database["public"]["Enums"]["tipo_contrato"]
          tipo_salario?: string | null
          titulo_eleitor?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dependentes: {
        Row: {
          colaborador_id: string
          cpf: string | null
          created_at: string
          data_nascimento: string
          id: string
          nome: string
          para_irrf: boolean | null
          para_plano_saude: boolean | null
          para_salario_familia: boolean | null
          parentesco: string
        }
        Insert: {
          colaborador_id: string
          cpf?: string | null
          created_at?: string
          data_nascimento: string
          id?: string
          nome: string
          para_irrf?: boolean | null
          para_plano_saude?: boolean | null
          para_salario_familia?: boolean | null
          parentesco: string
        }
        Update: {
          colaborador_id?: string
          cpf?: string | null
          created_at?: string
          data_nascimento?: string
          id?: string
          nome?: string
          para_irrf?: boolean | null
          para_plano_saude?: boolean | null
          para_salario_familia?: boolean | null
          parentesco?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependentes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_colaborador: {
        Row: {
          colaborador_id: string
          created_at: string
          created_by: string | null
          id: string
          nome_arquivo: string
          tamanho_bytes: number | null
          tipo: string
          url: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo: string
          tamanho_bytes?: number | null
          tipo: string
          url: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo?: string
          tamanho_bytes?: number | null
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_colaborador_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_variaveis: {
        Row: {
          colaborador_id: string
          competencia: string
          created_at: string
          created_by: string | null
          id: string
          observacao: string | null
          referencia: number | null
          rubrica_id: string
          valor: number
        }
        Insert: {
          colaborador_id: string
          competencia: string
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          referencia?: number | null
          rubrica_id: string
          valor: number
        }
        Update: {
          colaborador_id?: string
          competencia?: string
          created_at?: string
          created_by?: string | null
          id?: string
          observacao?: string | null
          referencia?: number | null
          rubrica_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "eventos_variaveis_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_variaveis_rubrica_id_fkey"
            columns: ["rubrica_id"]
            isOneToOne: false
            referencedRelation: "rubricas_folha"
            referencedColumns: ["id"]
          },
        ]
      }
      folhas_pagamento: {
        Row: {
          competencia: string
          created_at: string
          created_by: string | null
          data_calculo: string | null
          data_fechamento: string | null
          data_pagamento: string | null
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_folha"]
          tipo: string
          total_colaboradores: number | null
          total_descontos: number | null
          total_fgts: number | null
          total_inss_patronal: number | null
          total_liquido: number | null
          total_proventos: number | null
          updated_at: string
        }
        Insert: {
          competencia: string
          created_at?: string
          created_by?: string | null
          data_calculo?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_folha"]
          tipo?: string
          total_colaboradores?: number | null
          total_descontos?: number | null
          total_fgts?: number | null
          total_inss_patronal?: number | null
          total_liquido?: number | null
          total_proventos?: number | null
          updated_at?: string
        }
        Update: {
          competencia?: string
          created_at?: string
          created_by?: string | null
          data_calculo?: string | null
          data_fechamento?: string | null
          data_pagamento?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_folha"]
          tipo?: string
          total_colaboradores?: number | null
          total_descontos?: number | null
          total_fgts?: number | null
          total_inss_patronal?: number | null
          total_liquido?: number | null
          total_proventos?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      historico_cargo: {
        Row: {
          cargo_anterior: string | null
          cargo_novo: string
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_alteracao: string
          id: string
          motivo: string | null
          observacao: string | null
          salario_anterior: number | null
          salario_novo: number
        }
        Insert: {
          cargo_anterior?: string | null
          cargo_novo: string
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_alteracao: string
          id?: string
          motivo?: string | null
          observacao?: string | null
          salario_anterior?: number | null
          salario_novo: number
        }
        Update: {
          cargo_anterior?: string | null
          cargo_novo?: string
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_alteracao?: string
          id?: string
          motivo?: string | null
          observacao?: string | null
          salario_anterior?: number | null
          salario_novo?: number
        }
        Relationships: [
          {
            foreignKeyName: "historico_cargo_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      holerites: {
        Row: {
          base_fgts: number | null
          base_inss: number | null
          base_irrf: number | null
          colaborador_cargo: string
          colaborador_cpf: string
          colaborador_departamento: string
          colaborador_id: string
          colaborador_matricula: string | null
          colaborador_nome: string
          created_at: string
          dependentes_irrf: number | null
          faltas_dias: number | null
          folha_id: string
          horas_extras_100: number | null
          horas_extras_50: number | null
          id: string
          liquido: number
          salario_base: number
          total_descontos: number
          total_proventos: number
          valor_fgts: number | null
          valor_inss: number | null
          valor_irrf: number | null
        }
        Insert: {
          base_fgts?: number | null
          base_inss?: number | null
          base_irrf?: number | null
          colaborador_cargo: string
          colaborador_cpf: string
          colaborador_departamento: string
          colaborador_id: string
          colaborador_matricula?: string | null
          colaborador_nome: string
          created_at?: string
          dependentes_irrf?: number | null
          faltas_dias?: number | null
          folha_id: string
          horas_extras_100?: number | null
          horas_extras_50?: number | null
          id?: string
          liquido?: number
          salario_base: number
          total_descontos?: number
          total_proventos?: number
          valor_fgts?: number | null
          valor_inss?: number | null
          valor_irrf?: number | null
        }
        Update: {
          base_fgts?: number | null
          base_inss?: number | null
          base_irrf?: number | null
          colaborador_cargo?: string
          colaborador_cpf?: string
          colaborador_departamento?: string
          colaborador_id?: string
          colaborador_matricula?: string | null
          colaborador_nome?: string
          created_at?: string
          dependentes_irrf?: number | null
          faltas_dias?: number | null
          folha_id?: string
          horas_extras_100?: number | null
          horas_extras_50?: number | null
          id?: string
          liquido?: number
          salario_base?: number
          total_descontos?: number
          total_proventos?: number
          valor_fgts?: number | null
          valor_inss?: number | null
          valor_irrf?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "holerites_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holerites_folha_id_fkey"
            columns: ["folha_id"]
            isOneToOne: false
            referencedRelation: "folhas_pagamento"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_folha: {
        Row: {
          automatico: boolean | null
          created_at: string
          holerite_id: string
          id: string
          referencia: number | null
          rubrica_codigo: string
          rubrica_descricao: string
          rubrica_id: string
          tipo: Database["public"]["Enums"]["tipo_evento_folha"]
          valor: number
        }
        Insert: {
          automatico?: boolean | null
          created_at?: string
          holerite_id: string
          id?: string
          referencia?: number | null
          rubrica_codigo: string
          rubrica_descricao: string
          rubrica_id: string
          tipo: Database["public"]["Enums"]["tipo_evento_folha"]
          valor: number
        }
        Update: {
          automatico?: boolean | null
          created_at?: string
          holerite_id?: string
          id?: string
          referencia?: number | null
          rubrica_codigo?: string
          rubrica_descricao?: string
          rubrica_id?: string
          tipo?: Database["public"]["Enums"]["tipo_evento_folha"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_folha_holerite_id_fkey"
            columns: ["holerite_id"]
            isOneToOne: false
            referencedRelation: "holerites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_folha_rubrica_id_fkey"
            columns: ["rubrica_id"]
            isOneToOne: false
            referencedRelation: "rubricas_folha"
            referencedColumns: ["id"]
          },
        ]
      }
      parametros_fiscais: {
        Row: {
          aliquota: number | null
          ativo: boolean | null
          created_at: string
          deducao: number | null
          faixa: number | null
          id: string
          tipo: string
          valor_final: number | null
          valor_fixo: number | null
          valor_inicial: number | null
          vigencia_fim: string | null
          vigencia_inicio: string
        }
        Insert: {
          aliquota?: number | null
          ativo?: boolean | null
          created_at?: string
          deducao?: number | null
          faixa?: number | null
          id?: string
          tipo: string
          valor_final?: number | null
          valor_fixo?: number | null
          valor_inicial?: number | null
          vigencia_fim?: string | null
          vigencia_inicio: string
        }
        Update: {
          aliquota?: number | null
          ativo?: boolean | null
          created_at?: string
          deducao?: number | null
          faixa?: number | null
          id?: string
          tipo?: string
          valor_final?: number | null
          valor_fixo?: number | null
          valor_inicial?: number | null
          vigencia_fim?: string | null
          vigencia_inicio?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          departamento: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          departamento?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          departamento?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rubricas_folha: {
        Row: {
          ativo: boolean | null
          automatico: boolean | null
          codigo: string
          created_at: string
          descricao: string
          formula: string | null
          id: string
          incide_fgts: boolean | null
          incide_inss: boolean | null
          incide_irrf: boolean | null
          tipo: Database["public"]["Enums"]["tipo_evento_folha"]
        }
        Insert: {
          ativo?: boolean | null
          automatico?: boolean | null
          codigo: string
          created_at?: string
          descricao: string
          formula?: string | null
          id?: string
          incide_fgts?: boolean | null
          incide_inss?: boolean | null
          incide_irrf?: boolean | null
          tipo: Database["public"]["Enums"]["tipo_evento_folha"]
        }
        Update: {
          ativo?: boolean | null
          automatico?: boolean | null
          codigo?: string
          created_at?: string
          descricao?: string
          formula?: string | null
          id?: string
          incide_fgts?: boolean | null
          incide_inss?: boolean | null
          incide_irrf?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_evento_folha"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      escolaridade:
        | "fundamental_incompleto"
        | "fundamental_completo"
        | "medio_incompleto"
        | "medio_completo"
        | "superior_incompleto"
        | "superior_completo"
        | "pos_graduacao"
        | "mestrado"
        | "doutorado"
      estado_civil:
        | "solteiro"
        | "casado"
        | "divorciado"
        | "viuvo"
        | "separado"
        | "uniao_estavel"
      sexo: "masculino" | "feminino"
      status_colaborador:
        | "ativo"
        | "ferias"
        | "afastado"
        | "desligado"
        | "pendente"
      status_folha: "aberta" | "calculada" | "fechada" | "paga"
      tipo_conta: "corrente" | "poupanca" | "salario"
      tipo_contrato:
        | "clt"
        | "pj"
        | "estagiario"
        | "temporario"
        | "intermitente"
        | "aprendiz"
      tipo_evento_folha: "provento" | "desconto" | "informativo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      escolaridade: [
        "fundamental_incompleto",
        "fundamental_completo",
        "medio_incompleto",
        "medio_completo",
        "superior_incompleto",
        "superior_completo",
        "pos_graduacao",
        "mestrado",
        "doutorado",
      ],
      estado_civil: [
        "solteiro",
        "casado",
        "divorciado",
        "viuvo",
        "separado",
        "uniao_estavel",
      ],
      sexo: ["masculino", "feminino"],
      status_colaborador: [
        "ativo",
        "ferias",
        "afastado",
        "desligado",
        "pendente",
      ],
      status_folha: ["aberta", "calculada", "fechada", "paga"],
      tipo_conta: ["corrente", "poupanca", "salario"],
      tipo_contrato: [
        "clt",
        "pj",
        "estagiario",
        "temporario",
        "intermitente",
        "aprendiz",
      ],
      tipo_evento_folha: ["provento", "desconto", "informativo"],
    },
  },
} as const
