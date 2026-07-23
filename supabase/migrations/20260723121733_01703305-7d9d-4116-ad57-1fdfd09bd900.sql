CREATE OR REPLACE VIEW public.v_ferias_folha_reconciliacao
WITH (security_invoker = true) AS
SELECT
  f.id                        AS ferias_id,
  f.empresa_id,
  f.colaborador_id,
  c.nome_completo             AS colaborador_nome,
  f.data_inicio,
  f.data_fim,
  f.status,
  f.enviado_contabilidade,
  date_trunc('month', f.data_inicio)::date AS competencia,
  (
    (COALESCE(f.valor_ferias,0)       > 0)::int +
    (COALESCE(f.valor_terco,0)        > 0)::int +
    (COALESCE(f.valor_abono,0)        > 0)::int +
    (COALESCE(f.valor_terco_abono,0)  > 0)::int +
    (COALESCE(f.descontos_inss,0)     > 0)::int +
    (COALESCE(f.descontos_irrf,0)     > 0)::int +
    (COALESCE(f.valor_adiantamento_13,0) > 0)::int
  )                           AS rubricas_esperadas,
  COALESCE(ev.total, 0)       AS rubricas_geradas,
  CASE
    WHEN COALESCE(f.enviado_contabilidade, false) = false THEN 'pendente_envio'
    WHEN (
      (COALESCE(f.valor_ferias,0)       > 0)::int +
      (COALESCE(f.valor_terco,0)        > 0)::int +
      (COALESCE(f.valor_abono,0)        > 0)::int +
      (COALESCE(f.valor_terco_abono,0)  > 0)::int +
      (COALESCE(f.descontos_inss,0)     > 0)::int +
      (COALESCE(f.descontos_irrf,0)     > 0)::int +
      (COALESCE(f.valor_adiantamento_13,0) > 0)::int
    ) = COALESCE(ev.total, 0) THEN 'ok'
    ELSE 'divergente'
  END                         AS situacao
FROM public.ferias f
JOIN public.colaboradores c ON c.id = f.colaborador_id
LEFT JOIN LATERAL (
  SELECT COUNT(*)::int AS total
  FROM public.eventos_variaveis ev
  WHERE ev.origem_ferias_id = f.id
) ev ON TRUE
WHERE f.status = 'aprovada'
  AND COALESCE(f.cancelado, false) = false;

GRANT SELECT ON public.v_ferias_folha_reconciliacao TO authenticated;