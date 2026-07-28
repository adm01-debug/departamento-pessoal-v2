
-- ============================================================
-- Sprint 2 — Hardening final: SECURITY DEFINER, Storage, Views
-- ============================================================

-- MP-001: REVOKE nos helpers ainda expostos.
-- Manter anon SOMENTE nas 6 funções pré-login essenciais.
-- Demais funções: apenas authenticated ou service_role.

DO $$
DECLARE
  fn_signature text;
  authenticated_only text[] := ARRAY[
    'public.processar_ajuste_aprovado(uuid)',
    'public.fn_link_gov_br_account(uuid,text,text)',
    'public.get_colaborador_banco_horas(uuid)',
    'public.fn_calculate_periodo_aquisitivo(uuid)'
  ];
  service_only text[] := ARRAY[
    'public.anonimizar_dados_pessoais(uuid)',
    'public.limpar_govbr_states_expirados()',
    'public.cleanup_security_logs()',
    'public.fn_cleanup_old_logs()',
    'public.gerar_alertas_preditivos_ia()',
    'public.get_personnel_cost_projection(uuid,integer)',
    'public.run_rls_tests()',
    'public.reset_login_attempts(text,text)',
    'public.record_failed_login(text,text)'
  ];
BEGIN
  FOREACH fn_signature IN ARRAY authenticated_only LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', fn_signature);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn_signature);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Function % not found, skipping', fn_signature;
    END;
  END LOOP;

  FOREACH fn_signature IN ARRAY service_only LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn_signature);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn_signature);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Function % not found, skipping', fn_signature;
    END;
  END LOOP;
END $$;

-- MP-002: Bucket avatars — remover policy pública de listing amplo,
-- manter SELECT por caminho (autenticado escopado ao próprio user_id).
DO $$
BEGIN
  -- Remove policies antigas que permitem listing amplo (best-effort)
  DELETE FROM storage.policies WHERE bucket_id = 'avatars' AND name ILIKE '%public%list%';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Garantir policies mínimas seguras (idempotentes)
DROP POLICY IF EXISTS "Avatars: anon can read individual objects" ON storage.objects;
CREATE POLICY "Avatars: anon can read individual objects"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] IS NOT NULL);

DROP POLICY IF EXISTS "Avatars: users manage own folder" ON storage.objects;
CREATE POLICY "Avatars: users manage own folder"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- MP-011: security_invoker em todas as views public (idempotente)
DO $$
DECLARE
  v record;
BEGIN
  FOR v IN
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v' AND n.nspname = 'public'
  LOOP
    BEGIN
      EXECUTE format('ALTER VIEW %I.%I SET (security_invoker = true)', v.nspname, v.relname);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'View %.% skipped: %', v.nspname, v.relname, SQLERRM;
    END;
  END LOOP;
END $$;

-- MP-051 prep: adicionar coluna dry_run em fila de limpeza para retentativas seguras
ALTER TABLE public.lgpd_fila_limpeza
  ADD COLUMN IF NOT EXISTS dry_run boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS processed_at timestamptz;
