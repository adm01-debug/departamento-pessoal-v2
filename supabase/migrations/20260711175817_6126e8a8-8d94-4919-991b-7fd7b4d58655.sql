-- Reafirma GRANTs de EXECUTE para RPCs de anti-brute-force que devem ser acessíveis
-- ao papel anon (usadas antes da sessão existir).
REVOKE ALL ON FUNCTION public.check_login_lock(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_failed_login(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_login_lock(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.record_failed_login(text, text) TO anon, authenticated, service_role;