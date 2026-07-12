
ALTER TABLE public.colaboradores
  ADD CONSTRAINT chk_colaboradores_cpf_formato
  CHECK (cpf IS NULL OR length(regexp_replace(cpf, '\D', '', 'g')) = 11) NOT VALID;

ALTER TABLE public.dependentes
  ADD CONSTRAINT chk_dependentes_cpf_formato
  CHECK (cpf IS NULL OR length(regexp_replace(cpf, '\D', '', 'g')) = 11) NOT VALID;

ALTER TABLE public.colaboradores
  ADD CONSTRAINT chk_colaboradores_email_formato
  CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT VALID;

ALTER TABLE public.colaboradores
  ADD CONSTRAINT chk_colaboradores_email_corp_formato
  CHECK (email_corporativo IS NULL OR email_corporativo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT VALID;

ALTER TABLE public.colaboradores
  ADD CONSTRAINT chk_colaboradores_email_pes_formato
  CHECK (email_pessoal IS NULL OR email_pessoal ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT VALID;

ALTER TABLE public.folhas_pagamento
  ADD CONSTRAINT chk_folhas_totais_nao_negativos
  CHECK (
    COALESCE(total_proventos,0) >= 0
    AND COALESCE(total_descontos,0) >= 0
    AND COALESCE(total_liquido,0)  >= 0
  ) NOT VALID;

ALTER TABLE public.holerites
  ADD CONSTRAINT chk_holerites_valores_nao_negativos
  CHECK (
    COALESCE(total_proventos,0) >= 0
    AND COALESCE(total_descontos,0) >= 0
    AND COALESCE(liquido,0)         >= 0
    AND COALESCE(valor_inss,0)      >= 0
    AND COALESCE(valor_irrf,0)      >= 0
    AND COALESCE(valor_fgts,0)      >= 0
  ) NOT VALID;

ALTER TABLE public.desligamentos
  ADD CONSTRAINT chk_desligamentos_valores_nao_negativos
  CHECK (
    COALESCE(total_proventos,0) >= 0
    AND COALESCE(total_descontos,0) >= 0
    AND COALESCE(valor_liquido,0)   >= 0
  ) NOT VALID;

ALTER TABLE public.adiantamentos_salariais
  ADD CONSTRAINT chk_adiantamentos_valor_positivo
  CHECK (valor_solicitado IS NULL OR valor_solicitado >= 0) NOT VALID;

ALTER TABLE public.ferias
  ADD CONSTRAINT chk_ferias_periodo_coerente
  CHECK (data_inicio IS NULL OR data_fim IS NULL OR data_fim >= data_inicio) NOT VALID;

ALTER TABLE public.afastamentos
  ADD CONSTRAINT chk_afastamentos_prevista_coerente
  CHECK (data_inicio IS NULL OR data_fim_prevista IS NULL OR data_fim_prevista >= data_inicio) NOT VALID;

ALTER TABLE public.afastamentos
  ADD CONSTRAINT chk_afastamentos_real_coerente
  CHECK (data_inicio IS NULL OR data_fim_real IS NULL OR data_fim_real >= data_inicio) NOT VALID;
