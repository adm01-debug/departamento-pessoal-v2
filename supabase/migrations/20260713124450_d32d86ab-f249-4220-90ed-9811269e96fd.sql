
-- Melhoria #22: Auditoria automática de transições de status
-- AFTER UPDATE trigger genérico que loga em audit_log toda mudança de status.

CREATE OR REPLACE FUNCTION public.trg_audit_status_change() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _empresa uuid;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  BEGIN _uid := auth.uid(); EXCEPTION WHEN OTHERS THEN _uid := NULL; END;

  -- Best-effort empresa_id (nem toda tabela tem)
  BEGIN
    EXECUTE format('SELECT ($1).empresa_id') INTO _empresa USING NEW;
  EXCEPTION WHEN OTHERS THEN
    _empresa := NULL;
  END;

  INSERT INTO public.audit_log (
    tabela, registro_id, acao, user_id,
    dados_anteriores, dados_novos
  ) VALUES (
    TG_TABLE_NAME,
    NEW.id,
    'STATUS_CHANGE',
    _uid,
    jsonb_build_object('status', OLD.status, 'empresa_id', _empresa),
    jsonb_build_object('status', NEW.status, 'empresa_id', _empresa,
                       'changed_at', now())
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Auditoria nunca deve derrubar o UPDATE do domínio
  RETURN NEW;
END;
$$;

-- Aplicar às 8 tabelas de workflow
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'ferias','faltas','solicitacoes_ajuste_ponto','ciclos_avaliacao',
    'desligamentos','pdis','pesquisas','vagas'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_status_change ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER audit_status_change AFTER UPDATE OF status ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.trg_audit_status_change()', t);
  END LOOP;
END $$;

-- Índice para consultas de trilha por registro
CREATE INDEX IF NOT EXISTS idx_audit_log_status_change
  ON public.audit_log (tabela, registro_id, created_at DESC)
  WHERE acao = 'STATUS_CHANGE';
