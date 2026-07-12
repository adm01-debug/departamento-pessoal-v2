
CREATE OR REPLACE VIEW public.vw_folha_compliance
WITH (security_invoker = true) AS
SELECT
  a.id                                                   AS audit_id,
  a.created_at                                           AS event_at,
  a.acao                                                 AS acao,
  a.registro_id                                          AS folha_id,
  COALESCE(
    (a.dados_novos ->> 'empresaId')::uuid,
    (a.dados_novos ->> 'empresa_id')::uuid
  )                                                      AS empresa_id,
  COALESCE(
    a.dados_novos ->> 'competencia',
    a.dados_novos -> 'integritySnapshot' ->> 'competencia'
  )                                                      AS competencia,
  NULLIF(a.dados_novos ->> 'version_nova', '')::int      AS version_nova,
  NULLIF(a.dados_novos ->> 'version_anterior', '')::int  AS version_anterior,
  COALESCE(
    a.dados_novos ->> 'audit_hash',
    a.dados_novos ->> 'integrity_hash'
  )                                                      AS integrity_hash,
  NULLIF(a.dados_novos ->> 'total_proventos','')::numeric AS total_proventos,
  NULLIF(a.dados_novos ->> 'total_descontos','')::numeric AS total_descontos,
  NULLIF(a.dados_novos ->> 'total_liquido','')::numeric   AS total_liquido,
  NULLIF(a.dados_novos ->> 'total_fgts','')::numeric      AS total_fgts,
  NULLIF(a.dados_novos ->> 'holerites_count','')::int     AS holerites_count,
  NULLIF(a.dados_novos ->> 'itens_count','')::int         AS itens_count,
  a.dados_novos ->> 'motivo'                             AS motivo,
  (a.dados_novos ->> 'override_esocial')::boolean        AS override_esocial,
  a.user_id                                              AS user_id,
  a.user_email                                           AS user_email,
  a.ip_address                                           AS ip_address,
  a.dados_novos                                          AS dados_novos
FROM public.audit_log a
WHERE a.tabela = 'folhas_pagamento'
  AND a.acao IN ('PAYROLL_CALC', 'CLOSE', 'REOPEN');

GRANT SELECT ON public.vw_folha_compliance TO authenticated;
GRANT SELECT ON public.vw_folha_compliance TO service_role;

COMMENT ON VIEW public.vw_folha_compliance IS
  'Trilha consolidada de compliance da folha: cálculo (PAYROLL_CALC), fechamento (CLOSE) e reabertura (REOPEN). security_invoker=true — herda RLS de audit_log.';
