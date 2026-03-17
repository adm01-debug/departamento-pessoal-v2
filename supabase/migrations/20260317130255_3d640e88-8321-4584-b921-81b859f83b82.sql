
-- =============================================
-- ADD MISSING FK CONSTRAINTS: colaborador_id → colaboradores(id)
-- =============================================

DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'afastamentos','ajustes_ponto','anotacoes_colaborador','asos','banco_horas',
    'batidas_ponto','beneficiarios_plano','beneficiarios_seguro','beneficios',
    'beneficios_colaborador','colaborador_beneficios','contas_bancarias',
    'contatos_emergencia','contratos','controle_acesso','convenios_colaboradores',
    'dados_estagiario','dados_estrangeiro','deficiencias','dependentes',
    'desligamentos','despesas','documentos','documentos_colaborador',
    'documentos_pessoais_arquivos','epis_entregas','escalas_trabalho',
    'eventos_variaveis','exames','faltas','ferias','ferias_solicitacoes',
    'formacoes_academicas','historico_cargo','historico_contratos',
    'historico_salarial','holerites','inscricoes_cursos','lgpd_consentimentos',
    'lgpd_solicitacoes','lotacoes','medidas_disciplinares','metas_okrs',
    'onboarding_colaborador','pdis','pensoes','periodos_aquisitivos',
    'periodos_experiencia','pesquisas_respostas','planos_saude',
    'promocoes','recargas_vale','registros_ponto','seguros_colaboradores',
    'seguros_vida','sinistros_seguro','solicitacoes_hora_extra','transferencias',
    'treinamento_participantes','vales_alimentacao','vales_transporte',
    'valores_campos_customizados','vinculos'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT fk_%s_colaborador FOREIGN KEY (colaborador_id) REFERENCES public.colaboradores(id) ON DELETE CASCADE',
        tbl, tbl
      );
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- constraint already exists
    WHEN others THEN
      RAISE NOTICE 'Skipping FK on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- =============================================
-- ADD MISSING FK CONSTRAINTS: empresa_id → empresas(id)
-- =============================================

DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'admissoes','afastamentos','asos','banco_horas','banco_horas_config',
    'batidas_ponto','beneficios','campos_customizados','canal_etica','cargos',
    'catalogo_cursos','centros_custo','ciclos_avaliacao','colaboradores',
    'competencias_matriz','comunicados','configuracoes_intervalo','contas_bancarias',
    'contratos','controle_acesso','convenios','dados_estagiario',
    'dctfweb_declaracoes','departamentos','desligamentos','despesas',
    'documento_templates','documentos_assinatura','epis','epis_entregas',
    'escalas','escalas_trabalho','esocial_eventos','esocial_lotes',
    'faltas','feedbacks_360','feriados','ferias','ferias_coletivas',
    'ferias_solicitacoes','folhas_pagamento','guias_fgts','guias_inss',
    'historico_contratos','historico_salarial','inscricoes_cursos','jornadas',
    'lgpd_consentimentos','lgpd_solicitacoes','locais_trabalho','lotacoes',
    'medidas_disciplinares','metas_okrs','notificacoes','onboarding_templates',
    'pdis','pesquisas','planos_saude','registros_ponto','relatorios_agendados',
    'sefip_arquivos','seguros_vida','solicitacoes_hora_extra','times',
    'treinamentos','trilhas_aprendizado','turnos','vales_alimentacao',
    'webhooks','webhooks_config','workflows_definicoes','workflows_execucoes'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT fk_%s_empresa FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE',
        tbl, tbl
      );
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    WHEN others THEN
      RAISE NOTICE 'Skipping FK on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END;
$$;
