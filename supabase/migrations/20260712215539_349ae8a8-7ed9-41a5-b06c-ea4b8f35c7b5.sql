
-- 1) Revoga EXECUTE de anon/authenticated/PUBLIC em TODAS as trigger functions SECURITY DEFINER de public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    JOIN pg_type t ON t.oid = p.prorettype
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND t.typname = 'trigger'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated',
                   r.nspname, r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role',
                   r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- 2) Tightening da policy INSERT em folha_lock_conflicts (removendo o WITH CHECK true)
DROP POLICY IF EXISTS "sistema registra conflitos" ON public.folha_lock_conflicts;
CREATE POLICY "sistema registra conflitos" ON public.folha_lock_conflicts
  FOR INSERT TO authenticated
  WITH CHECK (
    -- Apenas registros com folha_id válido pertencente a empresa do usuário OU admin
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.folhas_pagamento f
      WHERE f.id = folha_lock_conflicts.folha_id
        AND f.empresa_id IN (SELECT public.get_user_scope_empresas(auth.uid()))
    )
  );
