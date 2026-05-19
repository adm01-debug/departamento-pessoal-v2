DROP POLICY IF EXISTS "Anyone can insert logs" ON public.logs_sistema;
CREATE POLICY "Anyone can insert logs"
ON public.logs_sistema
FOR INSERT
TO anon, authenticated
WITH CHECK (true);