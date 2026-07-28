
-- FASE 3: Criar Views de KPI e Dashboard

-- 3.1 vw_dashboard_time - Números gerais
CREATE OR REPLACE VIEW public.vw_dashboard_time AS
SELECT
  COUNT(*) FILTER (WHERE status = 'ativo') AS total_ativos,
  COUNT(*) FILTER (WHERE status = 'ferias') AS em_ferias,
  COUNT(*) FILTER (WHERE status = 'afastado') AS afastados,
  COUNT(*) FILTER (WHERE status = 'desligado') AS desligados,
  COUNT(*) AS total_geral
FROM public.colaboradores;

-- 3.2 vw_colaboradores_completo - Com departamento, cargo e tempo de casa
CREATE OR REPLACE VIEW public.vw_colaboradores_completo AS
SELECT
  c.id, c.nome_completo, c.cpf, c.email, c.foto_url, c.status,
  c.salario_base AS salario, c.data_admissao, c.tipo_contrato,
  c.celular AS telefone_celular, c.departamento, c.cargo,
  c.empresa_id,
  EXTRACT(YEAR FROM age(now(), c.data_admissao::timestamp)) || ' anos e ' ||
  EXTRACT(MONTH FROM age(now(), c.data_admissao::timestamp)) || ' meses' AS tempo_casa,
  c.data_desligamento
FROM public.colaboradores c;

-- 3.3 vw_alertas_rh - Alertas automáticos
CREATE OR REPLACE VIEW public.vw_alertas_rh AS
SELECT * FROM (
  -- Aniversariantes do mês
  SELECT
    c.id AS colaborador_id, c.nome_completo, c.empresa_id,
    'aniversario' AS tipo_alerta,
    'info' AS severidade,
    'Aniversário em ' || TO_CHAR(c.data_nascimento::date, 'DD/MM') AS mensagem,
    c.data_nascimento::date AS data_referencia
  FROM public.colaboradores c
  WHERE c.status = 'ativo'
    AND EXTRACT(MONTH FROM c.data_nascimento::date) = EXTRACT(MONTH FROM CURRENT_DATE)

  UNION ALL

  -- Aniversário de empresa
  SELECT
    c.id, c.nome_completo, c.empresa_id,
    'aniversario_empresa',
    'info',
    'Aniversário de empresa em ' || TO_CHAR(c.data_admissao::date, 'DD/MM'),
    c.data_admissao::date
  FROM public.colaboradores c
  WHERE c.status = 'ativo'
    AND EXTRACT(MONTH FROM c.data_admissao::date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM c.data_admissao::date) >= EXTRACT(DAY FROM CURRENT_DATE)
) alerts
ORDER BY data_referencia;

-- 3.4 vw_kpi_turnover - Taxa de turnover mensal (últimos 12 meses)
CREATE OR REPLACE VIEW public.vw_kpi_turnover AS
SELECT
  TO_CHAR(d.data_desligamento::date, 'YYYY-MM') AS mes,
  COUNT(*) AS desligamentos_mes,
  (SELECT COUNT(*) FROM public.colaboradores WHERE status = 'ativo') AS ativos_atual,
  ROUND(
    COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM public.colaboradores WHERE status = 'ativo'), 0) * 100, 2
  ) AS taxa_turnover
FROM public.desligamentos d
WHERE d.data_desligamento IS NOT NULL
  AND d.data_desligamento::date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(d.data_desligamento::date, 'YYYY-MM')
ORDER BY mes;

-- 3.5 vw_kpi_absenteismo - Taxa de absenteísmo
CREATE OR REPLACE VIEW public.vw_kpi_absenteismo AS
SELECT
  TO_CHAR(f.data, 'YYYY-MM') AS mes,
  COUNT(*) AS total_faltas,
  SUM(f.dias_total) AS dias_faltados,
  f.empresa_id
FROM public.faltas f
WHERE f.data >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(f.data, 'YYYY-MM'), f.empresa_id
ORDER BY mes;

-- 3.6 vw_banco_horas_saldo - Saldo atual do banco de horas
CREATE OR REPLACE VIEW public.vw_banco_horas_saldo AS
SELECT
  bh.colaborador_id,
  c.nome_completo,
  c.empresa_id,
  SUM(CASE WHEN bh.tipo = 'credito' THEN 1 ELSE -1 END * 
    EXTRACT(EPOCH FROM bh.horas::interval) / 3600) AS saldo_horas,
  MAX(bh.data) AS ultima_movimentacao
FROM public.banco_horas bh
JOIN public.colaboradores c ON c.id = bh.colaborador_id
GROUP BY bh.colaborador_id, c.nome_completo, c.empresa_id;

-- 3.7 vw_cadastro_incompleto - Colaboradores com dados faltantes
CREATE OR REPLACE VIEW public.vw_cadastro_incompleto AS
SELECT
  c.id, c.nome_completo, c.empresa_id, c.status,
  ARRAY_REMOVE(ARRAY[
    CASE WHEN c.cpf IS NULL OR c.cpf = '' THEN 'CPF' END,
    CASE WHEN c.rg IS NULL OR c.rg = '' THEN 'RG' END,
    CASE WHEN c.email IS NULL OR c.email = '' THEN 'Email' END,
    CASE WHEN c.celular IS NULL OR c.celular = '' THEN 'Celular' END,
    CASE WHEN c.cep IS NULL OR c.cep = '' THEN 'CEP' END,
    CASE WHEN c.pis_pasep IS NULL OR c.pis_pasep = '' THEN 'PIS' END,
    CASE WHEN c.data_nascimento IS NULL THEN 'Data Nascimento' END
  ], NULL) AS campos_faltantes,
  ARRAY_LENGTH(ARRAY_REMOVE(ARRAY[
    CASE WHEN c.cpf IS NULL OR c.cpf = '' THEN 'CPF' END,
    CASE WHEN c.rg IS NULL OR c.rg = '' THEN 'RG' END,
    CASE WHEN c.email IS NULL OR c.email = '' THEN 'Email' END,
    CASE WHEN c.celular IS NULL OR c.celular = '' THEN 'Celular' END,
    CASE WHEN c.cep IS NULL OR c.cep = '' THEN 'CEP' END,
    CASE WHEN c.pis_pasep IS NULL OR c.pis_pasep = '' THEN 'PIS' END,
    CASE WHEN c.data_nascimento IS NULL THEN 'Data Nascimento' END
  ], NULL), 1) AS total_faltantes
FROM public.colaboradores c
WHERE c.status = 'ativo'
  AND (c.cpf IS NULL OR c.cpf = '' OR c.rg IS NULL OR c.rg = '' OR
       c.email IS NULL OR c.email = '' OR c.pis_pasep IS NULL OR c.pis_pasep = '')
ORDER BY total_faltantes DESC NULLS LAST;
