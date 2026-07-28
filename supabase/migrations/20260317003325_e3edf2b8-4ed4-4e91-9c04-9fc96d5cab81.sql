
-- 1. Adicionar campos extras a registros_ponto
ALTER TABLE public.registros_ponto
  ADD COLUMN IF NOT EXISTS saida_intervalo TEXT,
  ADD COLUMN IF NOT EXISTS retorno_intervalo TEXT,
  ADD COLUMN IF NOT EXISTS atraso_minutos INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_batidas INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS entrada_esperada TEXT,
  ADD COLUMN IF NOT EXISTS saida_esperada TEXT;

-- 2. Unique constraint para upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registros_ponto_colaborador_data_uq'
  ) THEN
    ALTER TABLE public.registros_ponto
      ADD CONSTRAINT registros_ponto_colaborador_data_uq UNIQUE (colaborador_id, data);
  END IF;
END $$;

-- 3. Função de consolidação: batidas_ponto → registros_ponto
CREATE OR REPLACE FUNCTION public.fn_consolidar_batidas()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total_batidas INTEGER;
  v_entrada_1 TEXT;
  v_saida_1 TEXT;
  v_entrada_2 TEXT;
  v_saida_2 TEXT;
  v_entrada_3 TEXT;
  v_saida_3 TEXT;
  v_total_minutos INTEGER := 0;
  v_jornada RECORD;
  v_jornada_minutos INTEGER;
  v_atraso_minutos INTEGER := 0;
  v_extras_minutos INTEGER := 0;
  v_falta_minutos INTEGER := 0;
  v_horas_trab INTERVAL;
  v_horas_ext INTERVAL;
  v_horas_fal INTERVAL;
BEGIN
  SELECT COUNT(*) INTO v_total_batidas
  FROM public.batidas_ponto
  WHERE colaborador_id = NEW.colaborador_id AND data = NEW.data;

  SELECT
    MAX(CASE WHEN ordem = 1 AND tipo = 'entrada' THEN hora::text END),
    MAX(CASE WHEN ordem = 2 AND tipo = 'saida' THEN hora::text END),
    MAX(CASE WHEN ordem = 3 AND tipo = 'entrada' THEN hora::text END),
    MAX(CASE WHEN ordem = 4 AND tipo = 'saida' THEN hora::text END),
    MAX(CASE WHEN ordem = 5 AND tipo = 'entrada' THEN hora::text END),
    MAX(CASE WHEN ordem = 6 AND tipo = 'saida' THEN hora::text END)
  INTO v_entrada_1, v_saida_1, v_entrada_2, v_saida_2, v_entrada_3, v_saida_3
  FROM public.batidas_ponto
  WHERE colaborador_id = NEW.colaborador_id AND data = NEW.data;

  IF v_entrada_1 IS NOT NULL AND v_saida_1 IS NOT NULL THEN
    v_total_minutos := v_total_minutos + EXTRACT(EPOCH FROM (v_saida_1::time - v_entrada_1::time))::INTEGER / 60;
  END IF;
  IF v_entrada_2 IS NOT NULL AND v_saida_2 IS NOT NULL THEN
    v_total_minutos := v_total_minutos + EXTRACT(EPOCH FROM (v_saida_2::time - v_entrada_2::time))::INTEGER / 60;
  END IF;
  IF v_entrada_3 IS NOT NULL AND v_saida_3 IS NOT NULL THEN
    v_total_minutos := v_total_minutos + EXTRACT(EPOCH FROM (v_saida_3::time - v_entrada_3::time))::INTEGER / 60;
  END IF;

  v_horas_trab := (v_total_minutos || ' minutes')::INTERVAL;

  SELECT j.horario_entrada, j.horario_saida, j.carga_horaria_semanal
  INTO v_jornada
  FROM public.colaboradores c
  LEFT JOIN public.jornadas j ON j.id = c.jornada_id
  WHERE c.id = NEW.colaborador_id;

  IF v_jornada.carga_horaria_semanal IS NOT NULL THEN
    v_jornada_minutos := (v_jornada.carga_horaria_semanal * 60) / 5;
    IF v_entrada_1 IS NOT NULL AND v_jornada.horario_entrada IS NOT NULL THEN
      v_atraso_minutos := GREATEST(0,
        EXTRACT(EPOCH FROM (v_entrada_1::time - v_jornada.horario_entrada::time))::INTEGER / 60 - 10
      );
    END IF;
    IF v_total_minutos > v_jornada_minutos THEN
      v_extras_minutos := v_total_minutos - v_jornada_minutos;
    ELSE
      v_falta_minutos := v_jornada_minutos - v_total_minutos;
    END IF;
  END IF;

  v_horas_ext := (v_extras_minutos || ' minutes')::INTERVAL;
  v_horas_fal := (v_falta_minutos || ' minutes')::INTERVAL;

  INSERT INTO public.registros_ponto (
    colaborador_id, empresa_id, data,
    entrada_1, saida_1, entrada_2, saida_2, entrada_3, saida_3,
    saida_intervalo, retorno_intervalo,
    horas_trabalhadas, horas_extras, horas_falta,
    atraso_minutos, total_batidas,
    entrada_esperada, saida_esperada, tipo_dia
  ) VALUES (
    NEW.colaborador_id, NEW.empresa_id, NEW.data,
    v_entrada_1, v_saida_1, v_entrada_2, v_saida_2, v_entrada_3, v_saida_3,
    v_saida_1, v_entrada_2,
    v_horas_trab, v_horas_ext, v_horas_fal,
    v_atraso_minutos, v_total_batidas,
    v_jornada.horario_entrada, v_jornada.horario_saida, 'normal'
  )
  ON CONFLICT (colaborador_id, data)
  DO UPDATE SET
    entrada_1 = EXCLUDED.entrada_1,
    saida_1 = EXCLUDED.saida_1,
    entrada_2 = EXCLUDED.entrada_2,
    saida_2 = EXCLUDED.saida_2,
    entrada_3 = EXCLUDED.entrada_3,
    saida_3 = EXCLUDED.saida_3,
    saida_intervalo = EXCLUDED.saida_intervalo,
    retorno_intervalo = EXCLUDED.retorno_intervalo,
    horas_trabalhadas = EXCLUDED.horas_trabalhadas,
    horas_extras = EXCLUDED.horas_extras,
    horas_falta = EXCLUDED.horas_falta,
    atraso_minutos = EXCLUDED.atraso_minutos,
    total_batidas = EXCLUDED.total_batidas,
    entrada_esperada = EXCLUDED.entrada_esperada,
    saida_esperada = EXCLUDED.saida_esperada,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- 4. Trigger
DROP TRIGGER IF EXISTS trg_consolidar_batidas ON public.batidas_ponto;
CREATE TRIGGER trg_consolidar_batidas
  AFTER INSERT OR UPDATE ON public.batidas_ponto
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_consolidar_batidas();

-- 5. View: vw_batidas_resumo
CREATE OR REPLACE VIEW public.vw_batidas_resumo
WITH (security_invoker = true)
AS
SELECT
  bp.colaborador_id,
  c.nome_completo,
  bp.data,
  bp.empresa_id,
  jsonb_agg(jsonb_build_object('ordem', bp.ordem, 'hora', bp.hora::text, 'tipo', bp.tipo) ORDER BY bp.ordem) AS batidas,
  COUNT(*) AS total_batidas,
  MIN(CASE WHEN bp.tipo = 'entrada' THEN bp.hora END)::text AS primeira_entrada,
  MAX(CASE WHEN bp.tipo = 'saida' THEN bp.hora END)::text AS ultima_saida
FROM public.batidas_ponto bp
JOIN public.colaboradores c ON c.id = bp.colaborador_id
GROUP BY bp.colaborador_id, c.nome_completo, bp.data, bp.empresa_id;

-- 6. View: vw_saldo_compensacao_mensal
CREATE OR REPLACE VIEW public.vw_saldo_compensacao_mensal
WITH (security_invoker = true)
AS
SELECT
  rp.colaborador_id,
  c.nome_completo,
  rp.empresa_id,
  TO_CHAR(rp.data, 'YYYY-MM') AS competencia,
  COUNT(*) AS dias_trabalhados,
  SUM(EXTRACT(EPOCH FROM COALESCE(rp.horas_extras, '0'::interval))::INTEGER / 60) AS minutos_extras,
  SUM(EXTRACT(EPOCH FROM COALESCE(rp.horas_falta, '0'::interval))::INTEGER / 60) AS minutos_falta,
  SUM(COALESCE(rp.atraso_minutos, 0)) AS total_atrasos_minutos
FROM public.registros_ponto rp
JOIN public.colaboradores c ON c.id = rp.colaborador_id
WHERE rp.horas_trabalhadas IS NOT NULL
GROUP BY rp.colaborador_id, c.nome_completo, rp.empresa_id, TO_CHAR(rp.data, 'YYYY-MM');

-- 7. View: vw_alertas_compensacao
CREATE OR REPLACE VIEW public.vw_alertas_compensacao
WITH (security_invoker = true)
AS
SELECT
  bh.colaborador_id,
  c.nome_completo,
  bh.empresa_id,
  SUM(CASE WHEN bh.tipo = 'credito'
    THEN (SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
    ELSE -(SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
  END) AS saldo_minutos,
  CASE
    WHEN SUM(CASE WHEN bh.tipo = 'credito'
      THEN (SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
      ELSE -(SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
    END) < -480 THEN 'critico'
    WHEN SUM(CASE WHEN bh.tipo = 'credito'
      THEN (SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
      ELSE -(SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
    END) < -240 THEN 'alerta'
    ELSE 'normal'
  END AS nivel_alerta
FROM public.banco_horas bh
JOIN public.colaboradores c ON c.id = bh.colaborador_id
GROUP BY bh.colaborador_id, c.nome_completo, bh.empresa_id
HAVING SUM(CASE WHEN bh.tipo = 'credito'
  THEN (SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
  ELSE -(SPLIT_PART(bh.horas::text, ':', 1)::INTEGER * 60 + COALESCE(SPLIT_PART(bh.horas::text, ':', 2)::INTEGER, 0))
END) < 0;
