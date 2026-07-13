
-- Melhoria #19: CHECK constraints para colunas enum-like em TEXT/VARCHAR
-- Simulação: tabelas vazias validadas via SELECT anterior, sem risco de quebra de dados.
-- Cenários testados mentalmente:
-- 1) INSERT com status válido -> aceito ✅
-- 2) INSERT com status inválido/typo -> rejeitado com constraint error ✅
-- 3) UPDATE alterando para valor inválido -> rejeitado ✅
-- 4) NULL permitido para preservar semântica atual ✅

ALTER TABLE public.ferias
  ADD CONSTRAINT chk_ferias_status CHECK (
    status IS NULL OR status IN (
      'solicitada','em_analise','aprovada','rejeitada','cancelada',
      'agendada','em_gozo','concluida','pendente_aprovacao','vencida'
    )
  );

ALTER TABLE public.ciclos_avaliacao
  ADD CONSTRAINT chk_ciclos_avaliacao_status CHECK (
    status IS NULL OR status IN ('rascunho','ativo','em_andamento','concluido','cancelado','arquivado')
  ),
  ADD CONSTRAINT chk_ciclos_avaliacao_tipo CHECK (
    tipo IS NULL OR tipo IN ('desempenho','360','competencias','okr','pdi','experiencia','anual','semestral','trimestral')
  );

ALTER TABLE public.desligamentos
  ADD CONSTRAINT chk_desligamentos_status CHECK (
    status IS NULL OR status IN (
      'rascunho','em_andamento','aguardando_aprovacao','aprovado','rejeitado',
      'concluido','cancelado','homologado'
    )
  ),
  ADD CONSTRAINT chk_desligamentos_etapa CHECK (
    etapa IS NULL OR etapa IN (
      'iniciado','comunicacao','documentacao','calculo_rescisao','pagamento',
      'homologacao','esocial','devolucao_equipamentos','revogacao_acessos','concluido'
    )
  );

ALTER TABLE public.faltas
  ADD CONSTRAINT chk_faltas_status CHECK (
    status IS NULL OR status IN ('pendente','justificada','abonada','injustificada','em_analise','rejeitada')
  ),
  ADD CONSTRAINT chk_faltas_tipo CHECK (
    tipo IS NULL OR tipo IN (
      'atestado_medico','falta_injustificada','falta_justificada','licenca',
      'ausencia_parcial','atraso','saida_antecipada','luto','casamento',
      'doacao_sangue','servico_militar','doenca_familiar','maternidade',
      'paternidade','outros'
    )
  );

ALTER TABLE public.folhas_pagamento
  ADD CONSTRAINT chk_folhas_pagamento_tipo CHECK (
    tipo IS NULL OR tipo IN ('mensal','13_primeira','13_segunda','ferias','rescisao','adiantamento','complementar','pro_labore')
  );

ALTER TABLE public.notificacoes
  ADD CONSTRAINT chk_notificacoes_tipo CHECK (
    tipo IS NULL OR tipo IN ('info','sucesso','aviso','erro','sistema','ponto','ferias','folha','beneficio','documento','avaliacao','treinamento','admissao','desligamento')
  );

ALTER TABLE public.pdis
  ADD CONSTRAINT chk_pdis_status CHECK (
    status IS NULL OR status IN ('rascunho','ativo','em_andamento','pausado','concluido','cancelado','vencido')
  );

ALTER TABLE public.pesquisas
  ADD CONSTRAINT chk_pesquisas_status CHECK (
    status IS NULL OR status IN ('rascunho','ativa','encerrada','arquivada','cancelada')
  ),
  ADD CONSTRAINT chk_pesquisas_tipo CHECK (
    tipo IS NULL OR tipo IN ('clima','engajamento','enps','pulse','saida','onboarding','360','ad_hoc')
  );

ALTER TABLE public.solicitacoes_ajuste_ponto
  ADD CONSTRAINT chk_solicitacoes_ajuste_ponto_status CHECK (
    status IS NULL OR status IN ('pendente','em_analise','aprovada','rejeitada','cancelada','estornada')
  );

ALTER TABLE public.vagas
  ADD CONSTRAINT chk_vagas_status CHECK (
    status IS NULL OR status IN ('rascunho','aberta','pausada','encerrada','preenchida','cancelada','arquivada')
  );

COMMENT ON CONSTRAINT chk_ferias_status ON public.ferias IS 'Fail-fast: valores canônicos do workflow de férias.';
