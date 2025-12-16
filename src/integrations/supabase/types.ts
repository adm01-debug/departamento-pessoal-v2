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
      afastamentos: {
        Row: {
          atestado_numero: string | null
          cid: string | null
          cid_descricao: string | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_fim_prevista: string
          data_fim_real: string | null
          data_inicio: string
          data_pericia: string | null
          dias_empresa: number | null
          dias_inss: number | null
          dias_total: number | null
          id: string
          medico_crm: string | null
          medico_nome: string | null
          numero_beneficio: string | null
          observacoes: string | null
          status: Database["public"]["Enums"]["status_afastamento"] | null
          tipo: Database["public"]["Enums"]["tipo_afastamento"]
          updated_at: string
        }
        Insert: {
          atestado_numero?: string | null
          cid?: string | null
          cid_descricao?: string | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_fim_prevista: string
          data_fim_real?: string | null
          data_inicio: string
          data_pericia?: string | null
          dias_empresa?: number | null
          dias_inss?: number | null
          dias_total?: number | null
          id?: string
          medico_crm?: string | null
          medico_nome?: string | null
          numero_beneficio?: string | null
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_afastamento"] | null
          tipo: Database["public"]["Enums"]["tipo_afastamento"]
          updated_at?: string
        }
        Update: {
          atestado_numero?: string | null
          cid?: string | null
          cid_descricao?: string | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_fim_prevista?: string
          data_fim_real?: string | null
          data_inicio?: string
          data_pericia?: string | null
          dias_empresa?: number | null
          dias_inss?: number | null
          dias_total?: number | null
          id?: string
          medico_crm?: string | null
          medico_nome?: string | null
          numero_beneficio?: string | null
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_afastamento"] | null
          tipo?: Database["public"]["Enums"]["tipo_afastamento"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afastamentos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      ajustes_ponto: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          campo_alterado: string
          colaborador_id: string
          created_at: string
          created_by: string | null
          id: string
          motivo: string
          registro_ponto_id: string
          status: string | null
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          campo_alterado: string
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          motivo: string
          registro_ponto_id: string
          status?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          campo_alterado?: string
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          motivo?: string
          registro_ponto_id?: string
          status?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ajustes_ponto_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajustes_ponto_registro_ponto_id_fkey"
            columns: ["registro_ponto_id"]
            isOneToOne: false
            referencedRelation: "registros_ponto"
            referencedColumns: ["id"]
          },
        ]
      }
      banco_horas: {
        Row: {
          colaborador_id: string
          created_at: string
          created_by: string | null
          data: string
          horas: unknown
          id: string
          motivo: string | null
          registro_ponto_id: string | null
          saldo_anterior: unknown
          saldo_atual: unknown
          tipo: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data: string
          horas: unknown
          id?: string
          motivo?: string | null
          registro_ponto_id?: string | null
          saldo_anterior?: unknown
          saldo_atual?: unknown
          tipo: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data?: string
          horas?: unknown
          id?: string
          motivo?: string | null
          registro_ponto_id?: string | null
          saldo_anterior?: unknown
          saldo_atual?: unknown
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "banco_horas_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banco_horas_registro_ponto_id_fkey"
            columns: ["registro_ponto_id"]
            isOneToOne: false
            referencedRelation: "registros_ponto"
            referencedColumns: ["id"]
          },
        ]
      }
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
      config_afastamentos: {
        Row: {
          created_at: string
          descricao: string | null
          dias_empresa_maximo: number | null
          dias_maximos: number | null
          dias_minimos: number | null
          id: string
          pago_empresa: boolean | null
          pago_inss: boolean | null
          tipo: Database["public"]["Enums"]["tipo_afastamento"]
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          dias_empresa_maximo?: number | null
          dias_maximos?: number | null
          dias_minimos?: number | null
          id?: string
          pago_empresa?: boolean | null
          pago_inss?: boolean | null
          tipo: Database["public"]["Enums"]["tipo_afastamento"]
        }
        Update: {
          created_at?: string
          descricao?: string | null
          dias_empresa_maximo?: number | null
          dias_maximos?: number | null
          dias_minimos?: number | null
          id?: string
          pago_empresa?: boolean | null
          pago_inss?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_afastamento"]
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
      documentos_afastamento: {
        Row: {
          afastamento_id: string
          created_at: string
          created_by: string | null
          id: string
          nome_arquivo: string
          tipo: string
          url: string
        }
        Insert: {
          afastamento_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo: string
          tipo: string
          url: string
        }
        Update: {
          afastamento_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo?: string
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_afastamento_afastamento_id_fkey"
            columns: ["afastamento_id"]
            isOneToOne: false
            referencedRelation: "afastamentos"
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
      feriados: {
        Row: {
          cidade: string | null
          created_at: string
          data: string
          descricao: string
          id: string
          tipo: string | null
          uf: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          data: string
          descricao: string
          id?: string
          tipo?: string | null
          uf?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          tipo?: string | null
          uf?: string | null
        }
        Relationships: []
      }
      ferias: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_fim: string
          data_inicio: string
          data_pagamento: string | null
          descontos_inss: number | null
          descontos_irrf: number | null
          dias_abono: number | null
          dias_gozo: number
          id: string
          observacoes: string | null
          periodo_aquisitivo_id: string | null
          salario_base: number
          status: string | null
          updated_at: string
          valor_abono: number | null
          valor_ferias: number
          valor_liquido: number
          valor_terco: number
          valor_terco_abono: number | null
          valor_total: number
          vender_abono: boolean | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_fim: string
          data_inicio: string
          data_pagamento?: string | null
          descontos_inss?: number | null
          descontos_irrf?: number | null
          dias_abono?: number | null
          dias_gozo: number
          id?: string
          observacoes?: string | null
          periodo_aquisitivo_id?: string | null
          salario_base: number
          status?: string | null
          updated_at?: string
          valor_abono?: number | null
          valor_ferias: number
          valor_liquido: number
          valor_terco: number
          valor_terco_abono?: number | null
          valor_total: number
          vender_abono?: boolean | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_fim?: string
          data_inicio?: string
          data_pagamento?: string | null
          descontos_inss?: number | null
          descontos_irrf?: number | null
          dias_abono?: number | null
          dias_gozo?: number
          id?: string
          observacoes?: string | null
          periodo_aquisitivo_id?: string | null
          salario_base?: number
          status?: string | null
          updated_at?: string
          valor_abono?: number | null
          valor_ferias?: number
          valor_liquido?: number
          valor_terco?: number
          valor_terco_abono?: number | null
          valor_total?: number
          vender_abono?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ferias_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_periodo_aquisitivo_id_fkey"
            columns: ["periodo_aquisitivo_id"]
            isOneToOne: false
            referencedRelation: "periodos_aquisitivos"
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
      historico_ferias: {
        Row: {
          created_at: string
          created_by: string | null
          ferias_id: string
          id: string
          observacao: string | null
          status_anterior: string | null
          status_novo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          ferias_id: string
          id?: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          ferias_id?: string
          id?: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_ferias_ferias_id_fkey"
            columns: ["ferias_id"]
            isOneToOne: false
            referencedRelation: "ferias"
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
      periodos_aquisitivos: {
        Row: {
          colaborador_id: string
          created_at: string
          data_fim: string
          data_inicio: string
          dias_descontados: number | null
          dias_direito: number
          faltas_periodo: number | null
          id: string
          numero_periodo: number
          status: string | null
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          data_fim: string
          data_inicio: string
          dias_descontados?: number | null
          dias_direito?: number
          faltas_periodo?: number | null
          id?: string
          numero_periodo?: number
          status?: string | null
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          dias_descontados?: number | null
          dias_direito?: number
          faltas_periodo?: number | null
          id?: string
          numero_periodo?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "periodos_aquisitivos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      periodos_ponto: {
        Row: {
          competencia: string
          created_at: string
          data_fim: string
          data_inicio: string
          fechado_em: string | null
          fechado_por: string | null
          id: string
          status: string | null
        }
        Insert: {
          competencia: string
          created_at?: string
          data_fim: string
          data_inicio: string
          fechado_em?: string | null
          fechado_por?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          competencia?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          fechado_em?: string | null
          fechado_por?: string | null
          id?: string
          status?: string | null
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
      prorrogacoes_afastamento: {
        Row: {
          afastamento_id: string
          created_at: string
          created_by: string | null
          data_fim_anterior: string
          data_fim_nova: string
          data_pericia: string | null
          dias_adicionais: number
          id: string
          motivo: string | null
          numero_beneficio_novo: string | null
        }
        Insert: {
          afastamento_id: string
          created_at?: string
          created_by?: string | null
          data_fim_anterior: string
          data_fim_nova: string
          data_pericia?: string | null
          dias_adicionais: number
          id?: string
          motivo?: string | null
          numero_beneficio_novo?: string | null
        }
        Update: {
          afastamento_id?: string
          created_at?: string
          created_by?: string | null
          data_fim_anterior?: string
          data_fim_nova?: string
          data_pericia?: string | null
          dias_adicionais?: number
          id?: string
          motivo?: string | null
          numero_beneficio_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prorrogacoes_afastamento_afastamento_id_fkey"
            columns: ["afastamento_id"]
            isOneToOne: false
            referencedRelation: "afastamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_ponto: {
        Row: {
          aprovado: boolean | null
          aprovado_em: string | null
          aprovado_por: string | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data: string
          entrada_1: string | null
          entrada_2: string | null
          entrada_3: string | null
          horas_extras: unknown
          horas_falta: unknown
          horas_trabalhadas: unknown
          id: string
          justificativa: string | null
          observacoes: string | null
          saida_1: string | null
          saida_2: string | null
          saida_3: string | null
          tipo_dia: string | null
          updated_at: string
        }
        Insert: {
          aprovado?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data: string
          entrada_1?: string | null
          entrada_2?: string | null
          entrada_3?: string | null
          horas_extras?: unknown
          horas_falta?: unknown
          horas_trabalhadas?: unknown
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          saida_1?: string | null
          saida_2?: string | null
          saida_3?: string | null
          tipo_dia?: string | null
          updated_at?: string
        }
        Update: {
          aprovado?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data?: string
          entrada_1?: string | null
          entrada_2?: string | null
          entrada_3?: string | null
          horas_extras?: unknown
          horas_falta?: unknown
          horas_trabalhadas?: unknown
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          saida_1?: string | null
          saida_2?: string | null
          saida_3?: string | null
          tipo_dia?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registros_ponto_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
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
      calcular_dias_ferias: { Args: { faltas: number }; Returns: number }
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
      status_afastamento: "ativo" | "encerrado" | "cancelado" | "prorrogado"
      status_colaborador:
        | "ativo"
        | "ferias"
        | "afastado"
        | "desligado"
        | "pendente"
      status_folha: "aberta" | "calculada" | "fechada" | "paga"
      tipo_afastamento:
        | "doenca"
        | "acidente_trabalho"
        | "acidente_trajeto"
        | "licenca_maternidade"
        | "licenca_paternidade"
        | "licenca_casamento"
        | "licenca_obito"
        | "licenca_nao_remunerada"
        | "servico_militar"
        | "mandato_sindical"
        | "suspensao_disciplinar"
        | "outros"
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
      status_afastamento: ["ativo", "encerrado", "cancelado", "prorrogado"],
      status_colaborador: [
        "ativo",
        "ferias",
        "afastado",
        "desligado",
        "pendente",
      ],
      status_folha: ["aberta", "calculada", "fechada", "paga"],
      tipo_afastamento: [
        "doenca",
        "acidente_trabalho",
        "acidente_trajeto",
        "licenca_maternidade",
        "licenca_paternidade",
        "licenca_casamento",
        "licenca_obito",
        "licenca_nao_remunerada",
        "servico_militar",
        "mandato_sindical",
        "suspensao_disciplinar",
        "outros",
      ],
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
