
-- Fix login_attempts INSERT policy
DROP POLICY IF EXISTS "System can insert login attempts" ON public.login_attempts;
CREATE POLICY "System can insert login attempts" ON public.login_attempts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix rate_limit_logs INSERT policy
DROP POLICY IF EXISTS "System can insert rate limit logs" ON public.rate_limit_logs;
CREATE POLICY "System can insert rate limit logs" ON public.rate_limit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix security_alerts INSERT policy
DROP POLICY IF EXISTS "System can insert security alerts" ON public.security_alerts;
CREATE POLICY "System can insert security alerts" ON public.security_alerts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
