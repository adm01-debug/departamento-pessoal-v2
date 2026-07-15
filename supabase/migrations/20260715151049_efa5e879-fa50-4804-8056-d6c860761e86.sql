-- Melhoria #31: Endurecimento de funções SECURITY DEFINER
-- Estratégia: para toda função no schema public marcada como SECURITY DEFINER,
-- revogar EXECUTE de PUBLIC e anon, e conceder apenas a authenticated e service_role.
-- Idempotente e seguro: preserva has_role e demais helpers ainda utilizáveis pelo app.

DO $$
DECLARE
  r RECORD;
  sig TEXT;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema_name,
           p.proname AS func_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    sig := format('%I.%I(%s)', r.schema_name, r.func_name, r.args);
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', sig);
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', sig);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Falha ao endurecer %: %', sig, SQLERRM;
    END;
  END LOOP;
END $$;