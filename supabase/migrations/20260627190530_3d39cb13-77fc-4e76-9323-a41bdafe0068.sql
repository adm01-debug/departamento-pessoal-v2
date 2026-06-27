
-- Harden SECURITY DEFINER functions: revoke broad EXECUTE, re-grant only RPC-callable ones to authenticated.
-- Trigger functions don't need EXECUTE to anon/authenticated (triggers run as table owner).

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated',
                   r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role',
                   r.proname, r.args);
  END LOOP;
END $$;

-- Re-grant EXECUTE to authenticated ONLY for functions invoked via RPC / RLS policies from the client.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_empresas(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_default_empresa(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_scope_empresas(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_belongs_to_empresa(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_empresa_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_colaborador_banco_horas(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_calculate_periodo_aquisitivo(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calcular_dias_ferias(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_personnel_cost_projection(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_ip_blocked(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_ip_whitelisted(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_country_allowed(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.processar_ajuste_aprovado(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fn_link_gov_br_account(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_rls_tests() TO authenticated;

-- Anti-brute-force endpoints: allow anon (login screen) to call check/record without being signed in.
GRANT EXECUTE ON FUNCTION public.check_login_lock(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_failed_login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_login_attempts(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_brute_force(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, uuid) TO anon, authenticated;
