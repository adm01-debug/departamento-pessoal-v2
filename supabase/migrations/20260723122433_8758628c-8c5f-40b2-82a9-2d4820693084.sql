ALTER TABLE public.ferias_reconciliacao_logs
  ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES public.empresas(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_ferias_reconc_logs_empresa
  ON public.ferias_reconciliacao_logs(empresa_id, executado_em DESC);

DROP POLICY IF EXISTS "reconciliacao_logs_admin_read" ON public.ferias_reconciliacao_logs;
CREATE POLICY "reconciliacao_logs_admin_read"
ON public.ferias_reconciliacao_logs
FOR SELECT
TO authenticated
USING (
  (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'gestor')
    OR public.has_role(auth.uid(), 'rh')
  )
  AND (
    empresa_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.user_empresas ue
      WHERE ue.user_id = auth.uid() AND ue.empresa_id = ferias_reconciliacao_logs.empresa_id
    )
  )
);

DROP FUNCTION IF EXISTS public.reconciliar_ferias_folha_batch();

CREATE FUNCTION public.reconciliar_ferias_folha_batch()
RETURNS SETOF public.ferias_reconciliacao_logs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_started    timestamptz;
  v_verificadas int;
  v_corrigidas  int;
  v_restantes   int;
  v_emp record;
  v_row record;
  v_log public.ferias_reconciliacao_logs;
BEGIN
  FOR v_emp IN
    SELECT DISTINCT c.empresa_id
    FROM public.v_ferias_folha_reconciliacao v
    JOIN public.colaboradores c ON c.id = v.colaborador_id
    WHERE v.situacao = 'divergente' AND c.empresa_id IS NOT NULL
  LOOP
    v_started := clock_timestamp();
    v_verificadas := 0;
    v_corrigidas  := 0;

    FOR v_row IN
      SELECT v.ferias_id
      FROM public.v_ferias_folha_reconciliacao v
      JOIN public.colaboradores c ON c.id = v.colaborador_id
      WHERE v.situacao = 'divergente' AND c.empresa_id = v_emp.empresa_id
      LIMIT 500
    LOOP
      v_verificadas := v_verificadas + 1;
      BEGIN
        PERFORM public.gerar_rubricas_ferias(v_row.ferias_id);
        v_corrigidas := v_corrigidas + 1;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END LOOP;

    SELECT COUNT(*) INTO v_restantes
    FROM public.v_ferias_folha_reconciliacao v
    JOIN public.colaboradores c ON c.id = v.colaborador_id
    WHERE v.situacao = 'divergente' AND c.empresa_id = v_emp.empresa_id;

    INSERT INTO public.ferias_reconciliacao_logs (
      empresa_id, verificadas, corrigidas, restantes, duracao_ms
    ) VALUES (
      v_emp.empresa_id, v_verificadas, v_corrigidas, v_restantes,
      (EXTRACT(EPOCH FROM (clock_timestamp() - v_started)) * 1000)::int
    ) RETURNING * INTO v_log;

    RETURN NEXT v_log;
  END LOOP;

  RETURN;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reconciliar_ferias_folha_batch() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.reconciliar_ferias_folha_batch() TO service_role;

CREATE OR REPLACE FUNCTION public.trg_ferias_reconciliacao_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user uuid;
  v_titulo text;
  v_msg    text;
  v_data   date := (NEW.executado_em AT TIME ZONE 'America/Sao_Paulo')::date;
BEGIN
  IF NEW.restantes IS NULL OR NEW.restantes <= 0 THEN
    RETURN NEW;
  END IF;

  v_titulo := 'Férias: ' || NEW.restantes || ' divergência(s) após reconciliação';
  v_msg := 'A rotina automática verificou ' || NEW.verificadas
         || ' registros e corrigiu ' || NEW.corrigidas
         || ', porém ainda restam ' || NEW.restantes
         || ' divergência(s) entre férias e folha. Abra Férias → Dashboard para tratar.';

  FOR v_user IN
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    JOIN public.user_empresas ue ON ue.user_id = ur.user_id
    WHERE ur.role IN ('admin','gestor','rh')
      AND (NEW.empresa_id IS NULL OR ue.empresa_id = NEW.empresa_id)
  LOOP
    INSERT INTO public.notificacoes (
      user_id, empresa_id, tipo, titulo, mensagem, entidade_tipo, entidade_id, data_referencia
    )
    SELECT v_user, NEW.empresa_id, 'ferias_reconciliacao', v_titulo, v_msg,
           'ferias_reconciliacao_log', NEW.id, v_data
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notificacoes n
      WHERE n.user_id = v_user
        AND n.tipo = 'ferias_reconciliacao'
        AND n.data_referencia = v_data
        AND (n.empresa_id IS NOT DISTINCT FROM NEW.empresa_id)
    );
  END LOOP;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.trg_ferias_reconciliacao_alert() FROM PUBLIC, anon, authenticated;