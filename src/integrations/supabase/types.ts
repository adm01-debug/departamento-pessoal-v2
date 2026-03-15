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
      admissao_tokens: {
        Row: {
          admissao_id: string
          assinado_em: string | null
          assinatura_base64: string | null
          assinatura_url: string | null
          contrato_assinado: boolean | null
          contrato_gerado: boolean | null
          created_at: string
          dados_preenchidos: boolean | null
          data_expiracao: string
          documentos_enviados: boolean | null
          email_candidato: string | null
          id: string
          ip_assinatura: string | null
          telefone_candidato: string | null
          token: string
          updated_at: string
        }
        Insert: {
          admissao_id: string
          assinado_em?: string | null
          assinatura_base64?: string | null
          assinatura_url?: string | null
          contrato_assinado?: boolean | null
          contrato_gerado?: boolean | null
          created_at?: string
          dados_preenchidos?: boolean | null
          data_expiracao?: string
          documentos_enviados?: boolean | null
          email_candidato?: string | null
          id?: string
          ip_assinatura?: string | null
          telefone_candidato?: string | null
          token?: string
          updated_at?: string
        }
        Update: {
          admissao_id?: string
          assinado_em?: string | null
          assinatura_base64?: string | null
          assinatura_url?: string | null
          contrato_assinado?: boolean | null
          contrato_gerado?: boolean | null
          created_at?: string
          dados_preenchidos?: boolean | null
          data_expiracao?: string
          documentos_enviados?: boolean | null
          email_candidato?: string | null
          id?: string
          ip_assinatura?: string | null
          telefone_candidato?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissao_tokens_admissao_id_fkey"
            columns: ["admissao_id"]
            isOneToOne: false
            referencedRelation: "admissoes"
            referencedColumns: ["id"]
          },
        ]
      }
      admissoes: {
        Row: {
          cargo: string
          checklist_comprovante_endereco: boolean | null
          checklist_contrato_assinado: boolean | null
          checklist_ctps: boolean | null
          checklist_documentos_pessoais: boolean | null
          checklist_esocial_enviado: boolean | null
          checklist_exame_admissional: boolean | null
          checklist_foto: boolean | null
          cpf: string | null
          created_at: string
          created_by: string | null
          data_nascimento: string | null
          data_prevista: string
          departamento: string
          email: string | null
          empresa_id: string | null
          estado_civil: string | null
          etapa: Database["public"]["Enums"]["etapa_admissao"]
          id: string
          nome: string
          nome_mae: string | null
          observacoes: string | null
          salario_proposto: number
          sexo: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cargo: string
          checklist_comprovante_endereco?: boolean | null
          checklist_contrato_assinado?: boolean | null
          checklist_ctps?: boolean | null
          checklist_documentos_pessoais?: boolean | null
          checklist_esocial_enviado?: boolean | null
          checklist_exame_admissional?: boolean | null
          checklist_foto?: boolean | null
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          data_nascimento?: string | null
          data_prevista: string
          departamento: string
          email?: string | null
          empresa_id?: string | null
          estado_civil?: string | null
          etapa?: Database["public"]["Enums"]["etapa_admissao"]
          id?: string
          nome: string
          nome_mae?: string | null
          observacoes?: string | null
          salario_proposto: number
          sexo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cargo?: string
          checklist_comprovante_endereco?: boolean | null
          checklist_contrato_assinado?: boolean | null
          checklist_ctps?: boolean | null
          checklist_documentos_pessoais?: boolean | null
          checklist_esocial_enviado?: boolean | null
          checklist_exame_admissional?: boolean | null
          checklist_foto?: boolean | null
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          data_nascimento?: string | null
          data_prevista?: string
          departamento?: string
          email?: string | null
          empresa_id?: string | null
          estado_civil?: string | null
          etapa?: Database["public"]["Enums"]["etapa_admissao"]
          id?: string
          nome?: string
          nome_mae?: string | null
          observacoes?: string | null
          salario_proposto?: number
          sexo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
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
          empresa_id: string | null
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
          empresa_id?: string | null
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
          empresa_id?: string | null
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
          {
            foreignKeyName: "afastamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      anotacoes_colaborador: {
        Row: {
          colaborador_id: string
          conteudo: string | null
          created_at: string
          created_by: string | null
          data: string | null
          id: string
          tipo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          id?: string
          tipo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          data?: string | null
          id?: string
          tipo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anotacoes_colaborador_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      asos: {
        Row: {
          arquivo_url: string | null
          clinica: string | null
          colaborador_id: string
          created_at: string
          data_exame: string
          data_validade: string | null
          empresa_id: string | null
          id: string
          medico_crm: string | null
          medico_nome: string | null
          observacoes: string | null
          resultado: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          clinica?: string | null
          colaborador_id: string
          created_at?: string
          data_exame: string
          data_validade?: string | null
          empresa_id?: string | null
          id?: string
          medico_crm?: string | null
          medico_nome?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          clinica?: string | null
          colaborador_id?: string
          created_at?: string
          data_exame?: string
          data_validade?: string | null
          empresa_id?: string | null
          id?: string
          medico_crm?: string | null
          medico_nome?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          campos_alterados: string[] | null
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip_address: string | null
          registro_id: string
          tabela: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          campos_alterados?: string[] | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id: string
          tabela: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          campos_alterados?: string[] | null
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string
          tabela?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auditoria: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          descricao: string | null
          empresa_id: string | null
          entidade: string | null
          entidade_id: string | null
          id: string
          ip_address: string | null
          usuario_id: string | null
          usuario_nome: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          empresa_id?: string | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
          ip_address?: string | null
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          empresa_id?: string | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
          ip_address?: string | null
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Relationships: []
      }
      auditoria_logs: {
        Row: {
          acao: string
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          descricao: string | null
          entidade: string
          entidade_id: string | null
          id: string
          ip_address: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          entidade: string
          entidade_id?: string | null
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          entidade?: string
          entidade_id?: string | null
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      banco_horas: {
        Row: {
          colaborador_id: string
          created_at: string
          created_by: string | null
          data: string
          horas: string
          id: string
          motivo: string | null
          registro_ponto_id: string | null
          saldo_anterior: string | null
          saldo_atual: string | null
          tipo: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data: string
          horas: string
          id?: string
          motivo?: string | null
          registro_ponto_id?: string | null
          saldo_anterior?: string | null
          saldo_atual?: string | null
          tipo: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data?: string
          horas?: string
          id?: string
          motivo?: string | null
          registro_ponto_id?: string | null
          saldo_anterior?: string | null
          saldo_atual?: string | null
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
      beneficiarios_plano: {
        Row: {
          colaborador_id: string | null
          cpf: string | null
          created_at: string
          data_carencia: string | null
          data_exclusao: string | null
          data_inclusao: string | null
          id: string
          nome: string | null
          parentesco: string | null
          plano_saude_id: string | null
          status: string | null
          tipo: string | null
        }
        Insert: {
          colaborador_id?: string | null
          cpf?: string | null
          created_at?: string
          data_carencia?: string | null
          data_exclusao?: string | null
          data_inclusao?: string | null
          id?: string
          nome?: string | null
          parentesco?: string | null
          plano_saude_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Update: {
          colaborador_id?: string | null
          cpf?: string | null
          created_at?: string
          data_carencia?: string | null
          data_exclusao?: string | null
          data_inclusao?: string | null
          id?: string
          nome?: string | null
          parentesco?: string | null
          plano_saude_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficiarios_plano_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiarios_plano_plano_saude_id_fkey"
            columns: ["plano_saude_id"]
            isOneToOne: false
            referencedRelation: "planos_saude"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficiarios_seguro: {
        Row: {
          colaborador_id: string | null
          cpf: string | null
          created_at: string
          id: string
          nome: string
          parentesco: string | null
          percentual: number | null
          seguro_vida_id: string | null
          status: string | null
        }
        Insert: {
          colaborador_id?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          nome: string
          parentesco?: string | null
          percentual?: number | null
          seguro_vida_id?: string | null
          status?: string | null
        }
        Update: {
          colaborador_id?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          nome?: string
          parentesco?: string | null
          percentual?: number | null
          seguro_vida_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficiarios_seguro_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiarios_seguro_seguro_vida_id_fkey"
            columns: ["seguro_vida_id"]
            isOneToOne: false
            referencedRelation: "seguros_vida"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficios: {
        Row: {
          ativo: boolean | null
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string | null
          tipo: string | null
          updated_at: string
          valor: number | null
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          valor?: number | null
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficios_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficios_colaborador: {
        Row: {
          ativo: boolean | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          desconto: number | null
          id: string
          observacoes: string | null
          tipo_beneficio_id: string
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          desconto?: number | null
          id?: string
          observacoes?: string | null
          tipo_beneficio_id: string
          updated_at?: string
          valor?: number
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          desconto?: number | null
          id?: string
          observacoes?: string | null
          tipo_beneficio_id?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "beneficios_colaborador_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficios_colaborador_tipo_beneficio_id_fkey"
            columns: ["tipo_beneficio_id"]
            isOneToOne: false
            referencedRelation: "tipos_beneficio"
            referencedColumns: ["id"]
          },
        ]
      }
      bitrix24_config: {
        Row: {
          created_at: string | null
          dias_semana: number[] | null
          habilitado: boolean | null
          horario_fim: string | null
          horario_inicio: string | null
          id: number
          intervalo_minutos: number | null
          max_tentativas: number | null
          notificar_erros: boolean | null
          notificar_sucesso: boolean | null
          proxima_execucao: string | null
          sync_cargos: boolean | null
          sync_colaboradores: boolean | null
          sync_departamentos: boolean | null
          ultima_execucao: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          dias_semana?: number[] | null
          habilitado?: boolean | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: number
          intervalo_minutos?: number | null
          max_tentativas?: number | null
          notificar_erros?: boolean | null
          notificar_sucesso?: boolean | null
          proxima_execucao?: string | null
          sync_cargos?: boolean | null
          sync_colaboradores?: boolean | null
          sync_departamentos?: boolean | null
          ultima_execucao?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          dias_semana?: number[] | null
          habilitado?: boolean | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: number
          intervalo_minutos?: number | null
          max_tentativas?: number | null
          notificar_erros?: boolean | null
          notificar_sucesso?: boolean | null
          proxima_execucao?: string | null
          sync_cargos?: boolean | null
          sync_colaboradores?: boolean | null
          sync_departamentos?: boolean | null
          ultima_execucao?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      bitrix24_sync_logs: {
        Row: {
          conflitos: number | null
          created_at: string | null
          detalhes: Json | null
          direcao: string
          erros: number | null
          id: string
          registros_erro: number | null
          registros_processados: number | null
          registros_sucesso: number | null
          sucesso: number | null
          tipo: string
        }
        Insert: {
          conflitos?: number | null
          created_at?: string | null
          detalhes?: Json | null
          direcao: string
          erros?: number | null
          id?: string
          registros_erro?: number | null
          registros_processados?: number | null
          registros_sucesso?: number | null
          sucesso?: number | null
          tipo: string
        }
        Update: {
          conflitos?: number | null
          created_at?: string | null
          detalhes?: Json | null
          direcao?: string
          erros?: number | null
          id?: string
          registros_erro?: number | null
          registros_processados?: number | null
          registros_sucesso?: number | null
          sucesso?: number | null
          tipo?: string
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string
          permanent: boolean | null
          reason: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address: string
          permanent?: boolean | null
          reason?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string
          permanent?: boolean | null
          reason?: string | null
        }
        Relationships: []
      }
      campos_customizados: {
        Row: {
          ativo: boolean | null
          created_at: string
          empresa_id: string | null
          id: string
          nome: string
          obrigatorio: boolean | null
          opcoes: Json | null
          ordem: number | null
          secao: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          secao?: string | null
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          secao?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campos_customizados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          ativo: boolean | null
          cbo: string | null
          created_at: string
          departamento_id: string | null
          empresa_id: string | null
          id: string
          nome: string
          salario_base: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cbo?: string | null
          created_at?: string
          departamento_id?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          salario_base?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cbo?: string | null
          created_at?: string
          departamento_id?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          salario_base?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cargos_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      colaborador_beneficios: {
        Row: {
          beneficio_id: string
          colaborador_id: string
          created_at: string
          id: string
        }
        Insert: {
          beneficio_id: string
          colaborador_id: string
          created_at?: string
          id?: string
        }
        Update: {
          beneficio_id?: string
          colaborador_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaborador_beneficios_beneficio_id_fkey"
            columns: ["beneficio_id"]
            isOneToOne: false
            referencedRelation: "beneficios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_beneficios_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          agencia: string | null
          aposentado: boolean | null
          bairro: string | null
          banco_codigo: string | null
          banco_nome: string | null
          bitrix_id: string | null
          bitrix_sync_status: string | null
          bitrix_ultima_sync: string | null
          cargo: string
          cargo_confianca: boolean | null
          categoria_trabalhador: string | null
          cbo: string | null
          celular: string | null
          centro_custo: string | null
          cep: string | null
          certificado_reservista: string | null
          cidade: string | null
          cipa: boolean | null
          cnh_categoria: string | null
          cnh_numero: string | null
          cnh_validade: string | null
          complemento: string | null
          conselho_profissional: string | null
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
          data_exame_admissional: string | null
          data_nascimento: string
          departamento: string
          email: string | null
          email_corporativo: string | null
          empresa_id: string | null
          escolaridade: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil: Database["public"]["Enums"]["estado_civil"]
          etnia: string | null
          formacao: string | null
          foto_url: string | null
          horario_entrada: string | null
          horario_saida: string | null
          id: string
          identidade_genero: string | null
          inscricao_orgao_classe: string | null
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
          primeiro_emprego: boolean | null
          rg: string | null
          rg_data_emissao: string | null
          rg_orgao_emissor: string | null
          rg_uf: string | null
          salario_base: number
          seguro_desemprego: boolean | null
          sexo: Database["public"]["Enums"]["sexo"]
          status: Database["public"]["Enums"]["status_colaborador"]
          supervisor_id: string | null
          telefone: string | null
          time_id: string | null
          tipo_admissao: string | null
          tipo_conta: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato: Database["public"]["Enums"]["tipo_contrato"]
          tipo_estabilidade: string | null
          tipo_pagamento: string | null
          tipo_salario: string | null
          titulo_eleitor: string | null
          titulo_secao: string | null
          titulo_zona: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          aposentado?: boolean | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          bitrix_id?: string | null
          bitrix_sync_status?: string | null
          bitrix_ultima_sync?: string | null
          cargo: string
          cargo_confianca?: boolean | null
          categoria_trabalhador?: string | null
          cbo?: string | null
          celular?: string | null
          centro_custo?: string | null
          cep?: string | null
          certificado_reservista?: string | null
          cidade?: string | null
          cipa?: boolean | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_validade?: string | null
          complemento?: string | null
          conselho_profissional?: string | null
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
          data_exame_admissional?: string | null
          data_nascimento: string
          departamento: string
          email?: string | null
          email_corporativo?: string | null
          empresa_id?: string | null
          escolaridade?: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"]
          etnia?: string | null
          formacao?: string | null
          foto_url?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          identidade_genero?: string | null
          inscricao_orgao_classe?: string | null
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
          primeiro_emprego?: boolean | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          rg_uf?: string | null
          salario_base: number
          seguro_desemprego?: boolean | null
          sexo: Database["public"]["Enums"]["sexo"]
          status?: Database["public"]["Enums"]["status_colaborador"]
          supervisor_id?: string | null
          telefone?: string | null
          time_id?: string | null
          tipo_admissao?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato?: Database["public"]["Enums"]["tipo_contrato"]
          tipo_estabilidade?: string | null
          tipo_pagamento?: string | null
          tipo_salario?: string | null
          titulo_eleitor?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          aposentado?: boolean | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          bitrix_id?: string | null
          bitrix_sync_status?: string | null
          bitrix_ultima_sync?: string | null
          cargo?: string
          cargo_confianca?: boolean | null
          categoria_trabalhador?: string | null
          cbo?: string | null
          celular?: string | null
          centro_custo?: string | null
          cep?: string | null
          certificado_reservista?: string | null
          cidade?: string | null
          cipa?: boolean | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_validade?: string | null
          complemento?: string | null
          conselho_profissional?: string | null
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
          data_exame_admissional?: string | null
          data_nascimento?: string
          departamento?: string
          email?: string | null
          email_corporativo?: string | null
          empresa_id?: string | null
          escolaridade?: Database["public"]["Enums"]["escolaridade"] | null
          estado_civil?: Database["public"]["Enums"]["estado_civil"]
          etnia?: string | null
          formacao?: string | null
          foto_url?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          identidade_genero?: string | null
          inscricao_orgao_classe?: string | null
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
          primeiro_emprego?: boolean | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          rg_uf?: string | null
          salario_base?: number
          seguro_desemprego?: boolean | null
          sexo?: Database["public"]["Enums"]["sexo"]
          status?: Database["public"]["Enums"]["status_colaborador"]
          supervisor_id?: string | null
          telefone?: string | null
          time_id?: string | null
          tipo_admissao?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"] | null
          tipo_contrato?: Database["public"]["Enums"]["tipo_contrato"]
          tipo_estabilidade?: string | null
          tipo_pagamento?: string | null
          tipo_salario?: string | null
          titulo_eleitor?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaboradores_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      comunicados: {
        Row: {
          ativo: boolean | null
          conteudo: string | null
          created_at: string
          created_by: string | null
          data_expiracao: string | null
          data_publicacao: string | null
          empresa_id: string | null
          id: string
          prioridade: number | null
          tipo: string | null
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          data_expiracao?: string | null
          data_publicacao?: string | null
          empresa_id?: string | null
          id?: string
          prioridade?: number | null
          tipo?: string | null
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          data_expiracao?: string | null
          data_publicacao?: string | null
          empresa_id?: string | null
          id?: string
          prioridade?: number | null
          tipo?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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
      config_alertas_indicadores: {
        Row: {
          created_at: string
          id: string
          limite_atencao: number
          limite_critico: number
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          limite_atencao: number
          limite_critico: number
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          limite_atencao?: number
          limite_critico?: number
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string | null
          id: string
          updated_at: string | null
          valor: Json | null
        }
        Insert: {
          chave: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          valor?: Json | null
        }
        Update: {
          chave?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          valor?: Json | null
        }
        Relationships: []
      }
      contatos_emergencia: {
        Row: {
          celular: string | null
          colaborador_id: string
          created_at: string
          email: string | null
          id: string
          nome: string
          parentesco: string | null
          telefone: string | null
          telefone_trabalho: string | null
          updated_at: string
        }
        Insert: {
          celular?: string | null
          colaborador_id: string
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          parentesco?: string | null
          telefone?: string | null
          telefone_trabalho?: string | null
          updated_at?: string
        }
        Update: {
          celular?: string | null
          colaborador_id?: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          parentesco?: string | null
          telefone?: string | null
          telefone_trabalho?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contatos_emergencia_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          empresa_id: string | null
          id: string
          observacoes: string | null
          status: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          empresa_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          empresa_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contratos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      convenios: {
        Row: {
          ativo: boolean | null
          created_at: string
          empresa_id: string | null
          id: string
          limite_global: number | null
          nome: string
          tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          limite_global?: number | null
          nome: string
          tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          limite_global?: number | null
          nome?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convenios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      convenios_colaboradores: {
        Row: {
          ativo: boolean | null
          colaborador_id: string
          convenio_id: string
          created_at: string
          id: string
          limite_individual: number | null
          saldo_utilizado: number | null
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id: string
          convenio_id: string
          created_at?: string
          id?: string
          limite_individual?: number | null
          saldo_utilizado?: number | null
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string
          convenio_id?: string
          created_at?: string
          id?: string
          limite_individual?: number | null
          saldo_utilizado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "convenios_colaboradores_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convenios_colaboradores_convenio_id_fkey"
            columns: ["convenio_id"]
            isOneToOne: false
            referencedRelation: "convenios"
            referencedColumns: ["id"]
          },
        ]
      }
      dados_estrangeiro: {
        Row: {
          casado_brasileiro: boolean | null
          colaborador_id: string
          condicao_ingresso: string | null
          created_at: string
          data_chegada: string | null
          data_naturalizacao: string | null
          endereco_exterior: string | null
          filho_brasileiro: boolean | null
          id: string
          pais_origem: string | null
          reside_brasil: boolean | null
          tempo_residencia: string | null
          tipo_visto: string | null
          updated_at: string
        }
        Insert: {
          casado_brasileiro?: boolean | null
          colaborador_id: string
          condicao_ingresso?: string | null
          created_at?: string
          data_chegada?: string | null
          data_naturalizacao?: string | null
          endereco_exterior?: string | null
          filho_brasileiro?: boolean | null
          id?: string
          pais_origem?: string | null
          reside_brasil?: boolean | null
          tempo_residencia?: string | null
          tipo_visto?: string | null
          updated_at?: string
        }
        Update: {
          casado_brasileiro?: boolean | null
          colaborador_id?: string
          condicao_ingresso?: string | null
          created_at?: string
          data_chegada?: string | null
          data_naturalizacao?: string | null
          endereco_exterior?: string | null
          filho_brasileiro?: boolean | null
          id?: string
          pais_origem?: string | null
          reside_brasil?: boolean | null
          tempo_residencia?: string | null
          tipo_visto?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dados_estrangeiro_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: true
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      dctfweb_declaracoes: {
        Row: {
          competencia: string
          created_at: string
          data_geracao: string | null
          data_transmissao: string | null
          debitos: Json | null
          empresa_id: string | null
          id: string
          status: string | null
          total_debitos: number | null
          total_fgts: number | null
          total_remuneracao: number | null
        }
        Insert: {
          competencia: string
          created_at?: string
          data_geracao?: string | null
          data_transmissao?: string | null
          debitos?: Json | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          total_debitos?: number | null
          total_fgts?: number | null
          total_remuneracao?: number | null
        }
        Update: {
          competencia?: string
          created_at?: string
          data_geracao?: string | null
          data_transmissao?: string | null
          debitos?: Json | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          total_debitos?: number | null
          total_fgts?: number | null
          total_remuneracao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dctfweb_declaracoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      deficiencias: {
        Row: {
          cid: string | null
          colaborador_id: string
          cota_pcd: boolean | null
          created_at: string
          descricao: string | null
          id: string
          laudo_url: string | null
          observacoes: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          cid?: string | null
          colaborador_id: string
          cota_pcd?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          laudo_url?: string | null
          observacoes?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          cid?: string | null
          colaborador_id?: string
          cota_pcd?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          laudo_url?: string | null
          observacoes?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deficiencias_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: true
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      departamentos: {
        Row: {
          ativo: boolean | null
          created_at: string
          empresa_id: string | null
          gestor_id: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          gestor_id?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          gestor_id?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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
      desligamentos: {
        Row: {
          aviso_previo: number | null
          checklist_calculo_rescisao: boolean | null
          checklist_comunicacao: boolean | null
          checklist_devolucao_equipamentos: boolean | null
          checklist_documentacao: boolean | null
          checklist_esocial: boolean | null
          checklist_homologacao: boolean | null
          checklist_pagamento: boolean | null
          checklist_revogacao_acessos: boolean | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_aviso: string | null
          data_desligamento: string
          decimo_terceiro: number | null
          empresa_id: string | null
          ferias_proporcionais: number | null
          ferias_vencidas: number | null
          id: string
          motivo: string | null
          multa_fgts: number | null
          salario_base: number
          saldo_salario: number | null
          status: string
          terco_constitucional: number | null
          tipo: Database["public"]["Enums"]["tipo_desligamento"]
          total_descontos: number | null
          total_proventos: number | null
          updated_at: string
          valor_liquido: number | null
        }
        Insert: {
          aviso_previo?: number | null
          checklist_calculo_rescisao?: boolean | null
          checklist_comunicacao?: boolean | null
          checklist_devolucao_equipamentos?: boolean | null
          checklist_documentacao?: boolean | null
          checklist_esocial?: boolean | null
          checklist_homologacao?: boolean | null
          checklist_pagamento?: boolean | null
          checklist_revogacao_acessos?: boolean | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_aviso?: string | null
          data_desligamento: string
          decimo_terceiro?: number | null
          empresa_id?: string | null
          ferias_proporcionais?: number | null
          ferias_vencidas?: number | null
          id?: string
          motivo?: string | null
          multa_fgts?: number | null
          salario_base?: number
          saldo_salario?: number | null
          status?: string
          terco_constitucional?: number | null
          tipo: Database["public"]["Enums"]["tipo_desligamento"]
          total_descontos?: number | null
          total_proventos?: number | null
          updated_at?: string
          valor_liquido?: number | null
        }
        Update: {
          aviso_previo?: number | null
          checklist_calculo_rescisao?: boolean | null
          checklist_comunicacao?: boolean | null
          checklist_devolucao_equipamentos?: boolean | null
          checklist_documentacao?: boolean | null
          checklist_esocial?: boolean | null
          checklist_homologacao?: boolean | null
          checklist_pagamento?: boolean | null
          checklist_revogacao_acessos?: boolean | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_aviso?: string | null
          data_desligamento?: string
          decimo_terceiro?: number | null
          empresa_id?: string | null
          ferias_proporcionais?: number | null
          ferias_vencidas?: number | null
          id?: string
          motivo?: string | null
          multa_fgts?: number | null
          salario_base?: number
          saldo_salario?: number | null
          status?: string
          terco_constitucional?: number | null
          tipo?: Database["public"]["Enums"]["tipo_desligamento"]
          total_descontos?: number | null
          total_proventos?: number | null
          updated_at?: string
          valor_liquido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "desligamentos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desligamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      documento_templates: {
        Row: {
          ativo: boolean | null
          categoria: string
          conteudo_html: string
          created_at: string
          created_by: string | null
          empresa_id: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
          variaveis: Json | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string
          conteudo_html: string
          created_at?: string
          created_by?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
          variaveis?: Json | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          conteudo_html?: string
          created_at?: string
          created_by?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
          variaveis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "documento_templates_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          colaborador_id: string | null
          created_at: string
          data_validade: string | null
          id: string
          nome: string
          observacoes: string | null
          tipo: string
          updated_at: string
          url: string | null
          validado: boolean | null
          validado_por: string | null
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          data_validade?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          tipo: string
          updated_at?: string
          url?: string | null
          validado?: boolean | null
          validado_por?: string | null
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          data_validade?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
          url?: string | null
          validado?: boolean | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_admissao: {
        Row: {
          admissao_id: string
          created_at: string
          id: string
          nome_arquivo: string
          observacoes: string | null
          tamanho_bytes: number | null
          tipo: string
          url: string
          validado: boolean | null
          validado_em: string | null
          validado_por: string | null
        }
        Insert: {
          admissao_id: string
          created_at?: string
          id?: string
          nome_arquivo: string
          observacoes?: string | null
          tamanho_bytes?: number | null
          tipo: string
          url: string
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Update: {
          admissao_id?: string
          created_at?: string
          id?: string
          nome_arquivo?: string
          observacoes?: string | null
          tamanho_bytes?: number | null
          tipo?: string
          url?: string
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_admissao_admissao_id_fkey"
            columns: ["admissao_id"]
            isOneToOne: false
            referencedRelation: "admissoes"
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
      documentos_assinatura: {
        Row: {
          assinado_em: string | null
          assinado_por: string | null
          assinatura_base64: string | null
          colaborador_id: string
          conteudo_url: string | null
          created_at: string
          created_by: string | null
          empresa_id: string | null
          hash_documento: string | null
          id: string
          ip_assinatura: string | null
          status: string
          tipo_documento: string
          titulo: string
        }
        Insert: {
          assinado_em?: string | null
          assinado_por?: string | null
          assinatura_base64?: string | null
          colaborador_id: string
          conteudo_url?: string | null
          created_at?: string
          created_by?: string | null
          empresa_id?: string | null
          hash_documento?: string | null
          id?: string
          ip_assinatura?: string | null
          status?: string
          tipo_documento: string
          titulo: string
        }
        Update: {
          assinado_em?: string | null
          assinado_por?: string | null
          assinatura_base64?: string | null
          colaborador_id?: string
          conteudo_url?: string | null
          created_at?: string
          created_by?: string | null
          empresa_id?: string | null
          hash_documento?: string | null
          id?: string
          ip_assinatura?: string | null
          status?: string
          tipo_documento?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_assinatura_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_assinatura_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      empresas: {
        Row: {
          ativa: boolean | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          created_at: string
          email: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          logo_url: string | null
          logradouro: string | null
          nome_fantasia: string | null
          numero: string | null
          razao_social: string
          telefone: string | null
          uf: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logo_url?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logo_url?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string
          telefone?: string | null
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      escalas: {
        Row: {
          ativo: boolean | null
          created_at: string
          dias_folga: number | null
          dias_trabalho: number | null
          empresa_id: string | null
          horario_entrada: string | null
          horario_saida: string | null
          id: string
          intervalo_minutos: number | null
          nome: string
          tipo: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          dias_folga?: number | null
          dias_trabalho?: number | null
          empresa_id?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          nome: string
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          dias_folga?: number | null
          dias_trabalho?: number | null
          empresa_id?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          nome?: string
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_eventos: {
        Row: {
          competencia: string | null
          created_at: string
          dados: Json | null
          data_envio: string | null
          empresa_id: string | null
          erros: Json | null
          id: string
          protocolo: string | null
          status: string | null
          tipo_evento: string
          updated_at: string
          xml: string | null
        }
        Insert: {
          competencia?: string | null
          created_at?: string
          dados?: Json | null
          data_envio?: string | null
          empresa_id?: string | null
          erros?: Json | null
          id?: string
          protocolo?: string | null
          status?: string | null
          tipo_evento: string
          updated_at?: string
          xml?: string | null
        }
        Update: {
          competencia?: string | null
          created_at?: string
          dados?: Json | null
          data_envio?: string | null
          empresa_id?: string | null
          erros?: Json | null
          id?: string
          protocolo?: string | null
          status?: string | null
          tipo_evento?: string
          updated_at?: string
          xml?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esocial_eventos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_lotes: {
        Row: {
          ambiente: string | null
          created_at: string
          empresa_id: string | null
          eventos: Json | null
          id: string
          progresso: number | null
          protocolo: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          ambiente?: string | null
          created_at?: string
          empresa_id?: string | null
          eventos?: Json | null
          id?: string
          progresso?: number | null
          protocolo?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          ambiente?: string | null
          created_at?: string
          empresa_id?: string | null
          eventos?: Json | null
          id?: string
          progresso?: number | null
          protocolo?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esocial_lotes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      etnias: {
        Row: {
          codigo_esocial: number | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          codigo_esocial?: number | null
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          codigo_esocial?: number | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
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
      exames: {
        Row: {
          colaborador_id: string | null
          created_at: string
          crm: string | null
          data_exame: string | null
          data_validade: string | null
          id: string
          medico: string | null
          observacoes: string | null
          resultado: string | null
          tipo: string
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          crm?: string | null
          data_exame?: string | null
          data_validade?: string | null
          id?: string
          medico?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo: string
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          crm?: string | null
          data_exame?: string | null
          data_validade?: string | null
          id?: string
          medico?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "exames_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
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
          empresa_id: string | null
          id: string
          tipo: string | null
          uf: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          data: string
          descricao: string
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          uf?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          data?: string
          descricao?: string
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feriados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
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
          empresa_id: string | null
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
          empresa_id?: string | null
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
          empresa_id?: string | null
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
            foreignKeyName: "ferias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      ferias_coletivas: {
        Row: {
          aprovado_por: string | null
          created_at: string
          created_by: string | null
          data_fim: string
          data_inicio: string
          departamentos: string[] | null
          dias: number
          empresa_id: string
          id: string
          justificativa: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          created_by?: string | null
          data_fim: string
          data_inicio: string
          departamentos?: string[] | null
          dias: number
          empresa_id: string
          id?: string
          justificativa?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          created_by?: string | null
          data_fim?: string
          data_inicio?: string
          departamentos?: string[] | null
          dias?: number
          empresa_id?: string
          id?: string
          justificativa?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferias_coletivas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ferias_solicitacoes: {
        Row: {
          abono_pecuniario: boolean | null
          aprovado_em: string | null
          aprovado_por: string | null
          colaborador_id: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          dias: number | null
          empresa_id: string | null
          id: string
          observacoes: string | null
          status: string | null
        }
        Insert: {
          abono_pecuniario?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          dias?: number | null
          empresa_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
        }
        Update: {
          abono_pecuniario?: boolean | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          dias?: number | null
          empresa_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ferias_solicitacoes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferias_solicitacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
          empresa_id: string | null
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
          empresa_id?: string | null
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
          empresa_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "folhas_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      formacoes_academicas: {
        Row: {
          ano_conclusao: number | null
          colaborador_id: string
          created_at: string
          curso: string | null
          id: string
          instituicao: string | null
          situacao: string | null
          tipo_escolaridade: string | null
          updated_at: string
        }
        Insert: {
          ano_conclusao?: number | null
          colaborador_id: string
          created_at?: string
          curso?: string | null
          id?: string
          instituicao?: string | null
          situacao?: string | null
          tipo_escolaridade?: string | null
          updated_at?: string
        }
        Update: {
          ano_conclusao?: number | null
          colaborador_id?: string
          created_at?: string
          curso?: string | null
          id?: string
          instituicao?: string | null
          situacao?: string | null
          tipo_escolaridade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formacoes_academicas_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_allowed_countries: {
        Row: {
          added_by: string | null
          country_code: string
          country_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          added_by?: string | null
          country_code: string
          country_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          added_by?: string | null
          country_code?: string
          country_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      geo_blocked_attempts: {
        Row: {
          country_code: string | null
          country_name: string | null
          created_at: string | null
          id: string
          ip_address: string
          user_agent: string | null
        }
        Insert: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          id?: string
          ip_address: string
          user_agent?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      geo_blocking_config: {
        Row: {
          block_unknown_countries: boolean | null
          enabled: boolean | null
          id: string
          log_blocked_attempts: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          block_unknown_countries?: boolean | null
          enabled?: boolean | null
          id?: string
          log_blocked_attempts?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          block_unknown_countries?: boolean | null
          enabled?: boolean | null
          id?: string
          log_blocked_attempts?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      guias_fgts: {
        Row: {
          codigo_barras: string | null
          competencia: string
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          empresa_id: string | null
          id: string
          status: string | null
          tipo: string | null
          valor_multa: number | null
          valor_total: number | null
          valor_total_recolher: number | null
        }
        Insert: {
          codigo_barras?: string | null
          competencia: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          valor_multa?: number | null
          valor_total?: number | null
          valor_total_recolher?: number | null
        }
        Update: {
          codigo_barras?: string | null
          competencia?: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          valor_multa?: number | null
          valor_total?: number | null
          valor_total_recolher?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guias_fgts_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      guias_inss: {
        Row: {
          codigo_barras: string | null
          competencia: string
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          empresa_id: string | null
          id: string
          status: string | null
          tipo: string | null
          valor_empresa: number | null
          valor_segurados: number | null
          valor_total: number | null
        }
        Insert: {
          codigo_barras?: string | null
          competencia: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          valor_empresa?: number | null
          valor_segurados?: number | null
          valor_total?: number | null
        }
        Update: {
          codigo_barras?: string | null
          competencia?: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          valor_empresa?: number | null
          valor_segurados?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guias_inss_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_alertas: {
        Row: {
          created_at: string
          id: string
          limite: number
          mensagem: string
          nivel: string
          tipo: string
          valor: number
        }
        Insert: {
          created_at?: string
          id?: string
          limite: number
          mensagem: string
          nivel: string
          tipo: string
          valor: number
        }
        Update: {
          created_at?: string
          id?: string
          limite?: number
          mensagem?: string
          nivel?: string
          tipo?: string
          valor?: number
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
      historico_salarial: {
        Row: {
          ativo: boolean | null
          cargo_anterior: string | null
          cargo_novo: string | null
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_vigencia: string
          departamento_anterior: string | null
          departamento_novo: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          motivo: string
          salario_anterior: number | null
          salario_novo: number
          updated_at: string
          vinculo_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo_anterior?: string | null
          cargo_novo?: string | null
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_vigencia: string
          departamento_anterior?: string | null
          departamento_novo?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          motivo: string
          salario_anterior?: number | null
          salario_novo: number
          updated_at?: string
          vinculo_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo_anterior?: string | null
          cargo_novo?: string | null
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_vigencia?: string
          departamento_anterior?: string | null
          departamento_novo?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          motivo?: string
          salario_anterior?: number | null
          salario_novo?: number
          updated_at?: string
          vinculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_salarial_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_salarial_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      identidades_genero: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      integracoes: {
        Row: {
          ativa: boolean | null
          configuracao: Json | null
          created_at: string
          id: string
          nome: string
          status: string | null
          tipo: string
          ultima_sincronizacao: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          configuracao?: Json | null
          created_at?: string
          id?: string
          nome: string
          status?: string | null
          tipo: string
          ultima_sincronizacao?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          configuracao?: Json | null
          created_at?: string
          id?: string
          nome?: string
          status?: string | null
          tipo?: string
          ultima_sincronizacao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ip_whitelist: {
        Row: {
          added_by: string | null
          created_at: string | null
          description: string | null
          id: string
          ip_address: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      jornadas: {
        Row: {
          ativa: boolean | null
          carga_horaria_semanal: number | null
          created_at: string
          empresa_id: string | null
          horario_entrada: string | null
          horario_saida: string | null
          id: string
          intervalo_minutos: number | null
          nome: string
          tipo: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          carga_horaria_semanal?: number | null
          created_at?: string
          empresa_id?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          nome: string
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          carga_horaria_semanal?: number | null
          created_at?: string
          empresa_id?: string | null
          horario_entrada?: string | null
          horario_saida?: string | null
          id?: string
          intervalo_minutos?: number | null
          nome?: string
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jornadas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      linhas_transporte: {
        Row: {
          created_at: string
          id: string
          ida_volta: boolean | null
          nome: string
          tipo: string | null
          vale_transporte_id: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          ida_volta?: boolean | null
          nome: string
          tipo?: string | null
          vale_transporte_id?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          ida_volta?: boolean | null
          nome?: string
          tipo?: string | null
          vale_transporte_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "linhas_transporte_vale_transporte_id_fkey"
            columns: ["vale_transporte_id"]
            isOneToOne: false
            referencedRelation: "vales_transporte"
            referencedColumns: ["id"]
          },
        ]
      }
      log_envio_relatorios: {
        Row: {
          agendamento_id: string | null
          created_at: string
          id: string
          mensagem: string | null
          status: string
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          id?: string
          mensagem?: string | null
          status: string
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string
          id?: string
          mensagem?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "log_envio_relatorios_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "relatorios_agendados"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          created_at: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: string
          mfa_passed: boolean | null
          mfa_required: boolean | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address: string
          mfa_passed?: boolean | null
          mfa_required?: boolean | null
          success: boolean
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: string
          mfa_passed?: boolean | null
          mfa_required?: boolean | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      login_rate_limits: {
        Row: {
          created_at: string
          failed_attempts: number
          id: string
          identifier: string
          identifier_type: string
          last_attempt_at: string
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          failed_attempts?: number
          id?: string
          identifier: string
          identifier_type?: string
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          failed_attempts?: number
          id?: string
          identifier?: string
          identifier_type?: string
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      logs_integracoes: {
        Row: {
          created_at: string
          detalhes: Json | null
          id: string
          integracao_id: string | null
          mensagem: string | null
          status: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          integracao_id?: string | null
          mensagem?: string | null
          status?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          integracao_id?: string | null
          mensagem?: string | null
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_integracoes_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes"
            referencedColumns: ["id"]
          },
        ]
      }
      lotacoes: {
        Row: {
          ativa: boolean | null
          codigo: string | null
          colaborador_id: string | null
          created_at: string
          empresa_id: string | null
          endereco: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          codigo?: string | null
          colaborador_id?: string | null
          created_at?: string
          empresa_id?: string | null
          endereco?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          codigo?: string | null
          colaborador_id?: string | null
          created_at?: string
          empresa_id?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotacoes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lotacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          created_at: string
          data_referencia: string | null
          empresa_id: string | null
          entidade_id: string | null
          entidade_tipo: string | null
          id: string
          lida: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_referencia?: string | null
          empresa_id?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          id?: string
          lida?: boolean | null
          mensagem: string
          tipo: string
          titulo: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_referencia?: string | null
          empresa_id?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          tipo?: string
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes_admissao: {
        Row: {
          admissao_id: string
          assunto: string | null
          canal: string
          created_at: string
          erro: string | null
          id: string
          mensagem: string | null
          status: string | null
          tipo: string
        }
        Insert: {
          admissao_id: string
          assunto?: string | null
          canal: string
          created_at?: string
          erro?: string | null
          id?: string
          mensagem?: string | null
          status?: string | null
          tipo: string
        }
        Update: {
          admissao_id?: string
          assunto?: string | null
          canal?: string
          created_at?: string
          erro?: string | null
          id?: string
          mensagem?: string | null
          status?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_admissao_admissao_id_fkey"
            columns: ["admissao_id"]
            isOneToOne: false
            referencedRelation: "admissoes"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_colaborador: {
        Row: {
          colaborador_id: string
          created_at: string
          created_by: string | null
          data_conclusao: string | null
          data_inicio: string
          id: string
          progresso: number | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          created_by?: string | null
          data_conclusao?: string | null
          data_inicio?: string
          id?: string
          progresso?: number | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          created_by?: string | null
          data_conclusao?: string | null
          data_inicio?: string
          id?: string
          progresso?: number | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_colaborador_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_colaborador_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_tarefas: {
        Row: {
          categoria: string
          concluida: boolean | null
          concluida_por: string | null
          created_at: string
          data_conclusao: string | null
          data_prazo: string | null
          descricao: string | null
          id: string
          observacoes: string | null
          onboarding_id: string
          ordem: number
          template_tarefa_id: string | null
          titulo: string
        }
        Insert: {
          categoria?: string
          concluida?: boolean | null
          concluida_por?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          observacoes?: string | null
          onboarding_id: string
          ordem?: number
          template_tarefa_id?: string | null
          titulo: string
        }
        Update: {
          categoria?: string
          concluida?: boolean | null
          concluida_por?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_prazo?: string | null
          descricao?: string | null
          id?: string
          observacoes?: string | null
          onboarding_id?: string
          ordem?: number
          template_tarefa_id?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_tarefas_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "onboarding_colaborador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_tarefas_template_tarefa_id_fkey"
            columns: ["template_tarefa_id"]
            isOneToOne: false
            referencedRelation: "onboarding_template_tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_template_tarefas: {
        Row: {
          categoria: string
          created_at: string
          descricao: string | null
          dias_prazo: number | null
          id: string
          obrigatoria: boolean | null
          ordem: number
          responsavel_tipo: string | null
          template_id: string
          titulo: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          dias_prazo?: number | null
          id?: string
          obrigatoria?: boolean | null
          ordem?: number
          responsavel_tipo?: string | null
          template_id: string
          titulo: string
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          dias_prazo?: number | null
          id?: string
          obrigatoria?: boolean | null
          ordem?: number
          responsavel_tipo?: string | null
          template_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_template_tarefas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_templates: {
        Row: {
          ativo: boolean | null
          created_at: string
          created_by: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_templates_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      password_history: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      password_policies: {
        Row: {
          created_at: string | null
          id: string
          lockout_attempts: number | null
          lockout_duration_minutes: number | null
          max_age_days: number | null
          min_length: number | null
          prevent_reuse_count: number | null
          require_lowercase: boolean | null
          require_numbers: boolean | null
          require_special_chars: boolean | null
          require_uppercase: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lockout_attempts?: number | null
          lockout_duration_minutes?: number | null
          max_age_days?: number | null
          min_length?: number | null
          prevent_reuse_count?: number | null
          require_lowercase?: boolean | null
          require_numbers?: boolean | null
          require_special_chars?: boolean | null
          require_uppercase?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lockout_attempts?: number | null
          lockout_duration_minutes?: number | null
          max_age_days?: number | null
          min_length?: number | null
          prevent_reuse_count?: number | null
          require_lowercase?: boolean | null
          require_numbers?: boolean | null
          require_special_chars?: boolean | null
          require_uppercase?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      password_reset_config: {
        Row: {
          auto_expire_hours: number | null
          id: string
          notify_admins: boolean | null
          notify_user_on_approval: boolean | null
          notify_user_on_rejection: boolean | null
          require_approval: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          auto_expire_hours?: number | null
          id?: string
          notify_admins?: boolean | null
          notify_user_on_approval?: boolean | null
          notify_user_on_rejection?: boolean | null
          require_approval?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          auto_expire_hours?: number | null
          id?: string
          notify_admins?: boolean | null
          notify_user_on_approval?: boolean | null
          notify_user_on_rejection?: boolean | null
          require_approval?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      password_reset_requests: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          reason: string | null
          requested_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          user_agent: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          reason?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          user_agent?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          reason?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          user_agent?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      pensoes: {
        Row: {
          agencia: string | null
          ativo: boolean | null
          banco: string | null
          beneficiario: string
          colaborador_id: string | null
          conta: string | null
          cpf_beneficiario: string | null
          created_at: string
          id: string
          percentual: number | null
          tipo: string | null
          valor_fixo: number | null
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          beneficiario: string
          colaborador_id?: string | null
          conta?: string | null
          cpf_beneficiario?: string | null
          created_at?: string
          id?: string
          percentual?: number | null
          tipo?: string | null
          valor_fixo?: number | null
        }
        Update: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          beneficiario?: string
          colaborador_id?: string | null
          conta?: string | null
          cpf_beneficiario?: string | null
          created_at?: string
          id?: string
          percentual?: number | null
          tipo?: string | null
          valor_fixo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pensoes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
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
      periodos_experiencia: {
        Row: {
          colaborador_id: string
          created_at: string
          data_inicio: string
          dias_total: number | null
          id: string
          observacoes: string | null
          primeira_etapa_fim: string | null
          segunda_etapa_fim: string | null
          status: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          data_inicio: string
          dias_total?: number | null
          id?: string
          observacoes?: string | null
          primeira_etapa_fim?: string | null
          segunda_etapa_fim?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          data_inicio?: string
          dias_total?: number | null
          id?: string
          observacoes?: string | null
          primeira_etapa_fim?: string | null
          segunda_etapa_fim?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "periodos_experiencia_colaborador_id_fkey"
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
      permissions: {
        Row: {
          action: string
          allowed: boolean
          created_at: string
          id: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action: string
          allowed?: boolean
          created_at?: string
          id?: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action?: string
          allowed?: boolean
          created_at?: string
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      planos_saude: {
        Row: {
          ativo: boolean | null
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          empresa_id: string | null
          id: string
          numero_carteirinha: string | null
          operadora: string | null
          percentual_colaborador: number | null
          percentual_empresa: number | null
          tipo_plano: string | null
          valor_mensal: number | null
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id?: string | null
          id?: string
          numero_carteirinha?: string | null
          operadora?: string | null
          percentual_colaborador?: number | null
          percentual_empresa?: number | null
          tipo_plano?: string | null
          valor_mensal?: number | null
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id?: string | null
          id?: string
          numero_carteirinha?: string | null
          operadora?: string | null
          percentual_colaborador?: number | null
          percentual_empresa?: number | null
          tipo_plano?: string | null
          valor_mensal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "planos_saude_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_saude_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          departamento: string | null
          id: string
          nome: string
          role_display: string | null
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
          role_display?: string | null
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
          role_display?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promocoes: {
        Row: {
          cargo_anterior_id: string | null
          cargo_novo_id: string | null
          colaborador_id: string | null
          created_at: string
          data_vigencia: string
          id: string
          motivo: string | null
          salario_anterior: number | null
          salario_novo: number | null
        }
        Insert: {
          cargo_anterior_id?: string | null
          cargo_novo_id?: string | null
          colaborador_id?: string | null
          created_at?: string
          data_vigencia: string
          id?: string
          motivo?: string | null
          salario_anterior?: number | null
          salario_novo?: number | null
        }
        Update: {
          cargo_anterior_id?: string | null
          cargo_novo_id?: string | null
          colaborador_id?: string | null
          created_at?: string
          data_vigencia?: string
          id?: string
          motivo?: string | null
          salario_anterior?: number | null
          salario_novo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promocoes_cargo_anterior_id_fkey"
            columns: ["cargo_anterior_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocoes_cargo_novo_id_fkey"
            columns: ["cargo_novo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocoes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
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
      rate_limit_config: {
        Row: {
          block_duration_seconds: number
          created_at: string | null
          enabled: boolean | null
          endpoint: string
          id: string
          max_requests: number
          updated_at: string | null
          window_seconds: number
        }
        Insert: {
          block_duration_seconds?: number
          created_at?: string | null
          enabled?: boolean | null
          endpoint: string
          id?: string
          max_requests?: number
          updated_at?: string | null
          window_seconds?: number
        }
        Update: {
          block_duration_seconds?: number
          created_at?: string | null
          enabled?: boolean | null
          endpoint?: string
          id?: string
          max_requests?: number
          updated_at?: string | null
          window_seconds?: number
        }
        Relationships: []
      }
      rate_limit_logs: {
        Row: {
          blocked: boolean | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: string
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      recargas_vale: {
        Row: {
          colaborador_id: string | null
          created_at: string
          data_recarga: string | null
          id: string
          status: string | null
          vale_id: string | null
          valor: number
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          data_recarga?: string | null
          id?: string
          status?: string | null
          vale_id?: string | null
          valor: number
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          data_recarga?: string | null
          id?: string
          status?: string | null
          vale_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "recargas_vale_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recargas_vale_vale_id_fkey"
            columns: ["vale_id"]
            isOneToOne: false
            referencedRelation: "vales_alimentacao"
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
          empresa_id: string | null
          entrada_1: string | null
          entrada_2: string | null
          entrada_3: string | null
          horas_extras: string | null
          horas_falta: string | null
          horas_trabalhadas: string | null
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
          empresa_id?: string | null
          entrada_1?: string | null
          entrada_2?: string | null
          entrada_3?: string | null
          horas_extras?: string | null
          horas_falta?: string | null
          horas_trabalhadas?: string | null
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
          empresa_id?: string | null
          entrada_1?: string | null
          entrada_2?: string | null
          entrada_3?: string | null
          horas_extras?: string | null
          horas_falta?: string | null
          horas_trabalhadas?: string | null
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
          {
            foreignKeyName: "registros_ponto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_agendados: {
        Row: {
          ativo: boolean | null
          created_at: string
          created_by: string | null
          dia_mes: number | null
          dia_semana: number | null
          email_destinatario: string
          empresa_id: string | null
          formato: string
          frequencia: string
          hora_envio: string
          id: string
          nome: string
          parametros: Json | null
          proximo_envio: string | null
          tipo_relatorio: string
          ultimo_envio: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          created_by?: string | null
          dia_mes?: number | null
          dia_semana?: number | null
          email_destinatario: string
          empresa_id?: string | null
          formato?: string
          frequencia: string
          hora_envio?: string
          id?: string
          nome: string
          parametros?: Json | null
          proximo_envio?: string | null
          tipo_relatorio: string
          ultimo_envio?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          created_by?: string | null
          dia_mes?: number | null
          dia_semana?: number | null
          email_destinatario?: string
          empresa_id?: string | null
          formato?: string
          frequencia?: string
          hora_envio?: string
          id?: string
          nome?: string
          parametros?: Json | null
          proximo_envio?: string | null
          tipo_relatorio?: string
          ultimo_envio?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_agendados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          permission_code: string
          role: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          permission_code: string
          role: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          permission_code?: string
          role?: string
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
      saved_filters: {
        Row: {
          created_at: string
          entity_type: string
          filters: Json | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sefip_arquivos: {
        Row: {
          competencia: string
          conteudo: string | null
          created_at: string
          empresa_id: string | null
          id: string
          modalidade: number | null
          status: string | null
          total_colaboradores: number | null
          total_fgts: number | null
          total_remuneracao: number | null
          updated_at: string
        }
        Insert: {
          competencia: string
          conteudo?: string | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          modalidade?: number | null
          status?: string | null
          total_colaboradores?: number | null
          total_fgts?: number | null
          total_remuneracao?: number | null
          updated_at?: string
        }
        Update: {
          competencia?: string
          conteudo?: string | null
          created_at?: string
          empresa_id?: string | null
          id?: string
          modalidade?: number | null
          status?: string | null
          total_colaboradores?: number | null
          total_fgts?: number | null
          total_remuneracao?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sefip_arquivos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      seguros_colaboradores: {
        Row: {
          colaborador_id: string | null
          created_at: string
          data_adesao: string | null
          id: string
          seguro_vida_id: string | null
          status: string | null
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          data_adesao?: string | null
          id?: string
          seguro_vida_id?: string | null
          status?: string | null
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          data_adesao?: string | null
          id?: string
          seguro_vida_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguros_colaboradores_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguros_colaboradores_seguro_vida_id_fkey"
            columns: ["seguro_vida_id"]
            isOneToOne: false
            referencedRelation: "seguros_vida"
            referencedColumns: ["id"]
          },
        ]
      }
      seguros_vida: {
        Row: {
          ativo: boolean | null
          capital_segurado: number | null
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          empresa_id: string | null
          id: string
          numero_apolice: string | null
          premio_mensal: number | null
          seguradora: string | null
        }
        Insert: {
          ativo?: boolean | null
          capital_segurado?: number | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id?: string | null
          id?: string
          numero_apolice?: string | null
          premio_mensal?: number | null
          seguradora?: string | null
        }
        Update: {
          ativo?: boolean | null
          capital_segurado?: number | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id?: string | null
          id?: string
          numero_apolice?: string | null
          premio_mensal?: number | null
          seguradora?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguros_vida_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguros_vida_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sindicatos: {
        Row: {
          cnpj: string | null
          contribuicao_mensal: number | null
          created_at: string
          data_base: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          cnpj?: string | null
          contribuicao_mensal?: number | null
          created_at?: string
          data_base?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          cnpj?: string | null
          contribuicao_mensal?: number | null
          created_at?: string
          data_base?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      sinistros_seguro: {
        Row: {
          colaborador_id: string | null
          created_at: string
          data_sinistro: string | null
          descricao: string | null
          id: string
          seguro_vida_id: string | null
          status: string | null
          tipo: string | null
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          data_sinistro?: string | null
          descricao?: string | null
          id?: string
          seguro_vida_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          data_sinistro?: string | null
          descricao?: string | null
          id?: string
          seguro_vida_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sinistros_seguro_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sinistros_seguro_seguro_vida_id_fkey"
            columns: ["seguro_vida_id"]
            isOneToOne: false
            referencedRelation: "seguros_vida"
            referencedColumns: ["id"]
          },
        ]
      }
      times: {
        Row: {
          ativo: boolean | null
          created_at: string
          departamento_id: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          lider_id: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          departamento_id?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          lider_id?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          departamento_id?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          lider_id?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "times_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "times_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "times_lider_id_fkey"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_admissao: {
        Row: {
          codigo_esocial: number | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          codigo_esocial?: number | null
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          codigo_esocial?: number | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tipos_beneficio: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string
          desconto_colaborador: number | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          operadora: string | null
          valor_padrao: number | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string
          desconto_colaborador?: number | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          operadora?: string | null
          valor_padrao?: number | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string
          desconto_colaborador?: number | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          operadora?: string | null
          valor_padrao?: number | null
        }
        Relationships: []
      }
      tipos_estabilidade: {
        Row: {
          created_at: string
          descricao: string | null
          duracao_meses: number | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          duracao_meses?: number | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          duracao_meses?: number | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      transferencias: {
        Row: {
          colaborador_id: string
          created_at: string
          data_vigencia: string
          departamento_anterior_id: string | null
          departamento_novo_id: string | null
          id: string
          motivo: string | null
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          data_vigencia: string
          departamento_anterior_id?: string | null
          departamento_novo_id?: string | null
          id?: string
          motivo?: string | null
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          data_vigencia?: string
          departamento_anterior_id?: string | null
          departamento_novo_id?: string | null
          id?: string
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_departamento_anterior_id_fkey"
            columns: ["departamento_anterior_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_departamento_novo_id_fkey"
            columns: ["departamento_novo_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamento_participantes: {
        Row: {
          colaborador_id: string
          created_at: string
          id: string
          presente: boolean | null
          treinamento_id: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          id?: string
          presente?: boolean | null
          treinamento_id: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          id?: string
          presente?: boolean | null
          treinamento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treinamento_participantes_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamento_participantes_treinamento_id_fkey"
            columns: ["treinamento_id"]
            isOneToOne: false
            referencedRelation: "treinamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos: {
        Row: {
          carga_horaria: number | null
          created_at: string
          data: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
        }
        Insert: {
          carga_horaria?: number | null
          created_at?: string
          data?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
        }
        Update: {
          carga_horaria?: number | null
          created_at?: string
          data?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_empresas: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          is_default: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          is_default?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          is_default?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mfa: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          mfa_enabled: boolean | null
          mfa_secret: string | null
          mfa_type: string | null
          phone_number: string | null
          recovery_email: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          mfa_type?: string | null
          phone_number?: string | null
          recovery_email?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          mfa_type?: string | null
          phone_number?: string | null
          recovery_email?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity: string | null
          location: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vales_alimentacao: {
        Row: {
          ativo: boolean | null
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          dias_uteis: number | null
          empresa_id: string | null
          id: string
          tipo: string | null
          updated_at: string
          valor_mensal: number | null
          valor_por_dia: number | null
        }
        Insert: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          dias_uteis?: number | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string
          valor_mensal?: number | null
          valor_por_dia?: number | null
        }
        Update: {
          ativo?: boolean | null
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          dias_uteis?: number | null
          empresa_id?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string
          valor_mensal?: number | null
          valor_por_dia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vales_alimentacao_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vales_alimentacao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vales_transporte: {
        Row: {
          colaborador_id: string | null
          created_at: string
          desconto: number | null
          dias_uteis: number | null
          id: string
          optante: boolean | null
          percentual_desconto: number | null
          updated_at: string
          valor_diario: number | null
          valor_liquido: number | null
          valor_mensal: number | null
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string
          desconto?: number | null
          dias_uteis?: number | null
          id?: string
          optante?: boolean | null
          percentual_desconto?: number | null
          updated_at?: string
          valor_diario?: number | null
          valor_liquido?: number | null
          valor_mensal?: number | null
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string
          desconto?: number | null
          dias_uteis?: number | null
          id?: string
          optante?: boolean | null
          percentual_desconto?: number | null
          updated_at?: string
          valor_diario?: number | null
          valor_liquido?: number | null
          valor_mensal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vales_transporte_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      valores_campos_customizados: {
        Row: {
          campo_customizado_id: string
          colaborador_id: string
          created_at: string
          id: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          campo_customizado_id: string
          colaborador_id: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          campo_customizado_id?: string
          colaborador_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valores_campos_customizados_campo_customizado_id_fkey"
            columns: ["campo_customizado_id"]
            isOneToOne: false
            referencedRelation: "campos_customizados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valores_campos_customizados_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          type: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          type: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          type?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vinculos: {
        Row: {
          categoria: string | null
          colaborador_id: string
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          matricula: string | null
          status: string | null
          tipo: string
        }
        Insert: {
          categoria?: string | null
          colaborador_id: string
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          id?: string
          matricula?: string | null
          status?: string | null
          tipo: string
        }
        Update: {
          categoria?: string | null
          colaborador_id?: string
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          matricula?: string | null
          status?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "vinculos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      webauthn_challenges: {
        Row: {
          challenge: string
          created_at: string
          expires_at: string
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          challenge: string
          created_at?: string
          expires_at?: string
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          challenge?: string
          created_at?: string
          expires_at?: string
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          counter: number
          created_at: string
          credential_id: string
          device_type: string | null
          friendly_name: string | null
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number
          created_at?: string
          credential_id: string
          device_type?: string | null
          friendly_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number
          created_at?: string
          credential_id?: string
          device_type?: string | null
          friendly_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      webhooks_config: {
        Row: {
          ativo: boolean | null
          created_at: string
          empresa_id: string | null
          eventos: string[]
          id: string
          secret: string | null
          ultimo_envio: string | null
          ultimo_status: number | null
          updated_at: string
          url: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          eventos?: string[]
          id?: string
          secret?: string | null
          ultimo_envio?: string | null
          ultimo_status?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          empresa_id?: string | null
          eventos?: string[]
          id?: string
          secret?: string | null
          ultimo_envio?: string | null
          ultimo_status?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks_logs: {
        Row: {
          created_at: string
          evento: string
          id: string
          payload: Json | null
          resposta: string | null
          status_code: number | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          evento: string
          id?: string
          payload?: Json | null
          resposta?: string | null
          status_code?: number | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          evento?: string
          id?: string
          payload?: Json | null
          resposta?: string | null
          status_code?: number | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks_config"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_dias_ferias: { Args: { faltas: number }; Returns: number }
      calculate_lockout_duration: {
        Args: { attempts: number }
        Returns: string
      }
      check_brute_force: {
        Args: { check_email: string; check_ip: string }
        Returns: Json
      }
      check_login_lock: {
        Args: { p_identifier: string; p_identifier_type?: string }
        Returns: {
          is_locked: boolean
          locked_until_ts: string
          remaining_seconds: number
        }[]
      }
      check_rate_limit: {
        Args: {
          check_endpoint: string
          check_ip: string
          check_user_id?: string
        }
        Returns: Json
      }
      cleanup_security_logs: { Args: never; Returns: undefined }
      get_user_default_empresa: { Args: { _user_id: string }; Returns: string }
      get_user_empresas: { Args: { _user_id: string }; Returns: string[] }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_country_allowed: {
        Args: { check_country_code: string }
        Returns: boolean
      }
      is_ip_blocked: { Args: { check_ip: string }; Returns: boolean }
      is_ip_whitelisted: { Args: { check_ip: string }; Returns: boolean }
      record_failed_login: {
        Args: { p_identifier: string; p_identifier_type?: string }
        Returns: {
          attempts: number
          is_locked: boolean
          locked_until_ts: string
          lockout_minutes: number
        }[]
      }
      reset_login_attempts: {
        Args: { p_identifier: string; p_identifier_type?: string }
        Returns: undefined
      }
      user_belongs_to_empresa: {
        Args: { _empresa_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gestor" | "rh" | "user"
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
      etapa_admissao:
        | "solicitacao"
        | "documentos"
        | "validacao"
        | "pendente"
        | "exame"
        | "contrato"
        | "assinatura"
        | "esocial"
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
      tipo_desligamento:
        | "sem_justa_causa"
        | "justa_causa"
        | "pedido_demissao"
        | "acordo"
        | "fim_contrato"
        | "falecimento"
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
      app_role: ["admin", "gestor", "rh", "user"],
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
      etapa_admissao: [
        "solicitacao",
        "documentos",
        "validacao",
        "pendente",
        "exame",
        "contrato",
        "assinatura",
        "esocial",
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
      tipo_desligamento: [
        "sem_justa_causa",
        "justa_causa",
        "pedido_demissao",
        "acordo",
        "fim_contrato",
        "falecimento",
      ],
      tipo_evento_folha: ["provento", "desconto", "informativo"],
    },
  },
} as const
