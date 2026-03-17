
-- Fix historico_alertas: change from public to authenticated
DROP POLICY IF EXISTS "Authenticated users can insert historico_alertas" ON public.historico_alertas;

CREATE POLICY "Authenticated users can insert historico_alertas" ON public.historico_alertas
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
