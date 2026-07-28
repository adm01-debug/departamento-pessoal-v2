
-- Revoga execução pública/anon/authenticated de funções sensíveis
-- que só devem ser invocadas por Edge Functions (service_role)
-- ou internamente por outras funções SECURITY DEFINER.

REVOKE EXECUTE ON FUNCTION public.check_brute_force(text, text) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.check_brute_force(text, text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, uuid) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.check_rate_limit(text, text, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.is_ip_blocked(text) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_ip_blocked(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.is_ip_whitelisted(text) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_ip_whitelisted(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.is_country_allowed(text) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_country_allowed(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.fn_link_gov_br_account(uuid, text, text) FROM anon, authenticated, PUBLIC;
GRANT  EXECUTE ON FUNCTION public.fn_link_gov_br_account(uuid, text, text) TO service_role;
