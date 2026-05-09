CREATE POLICY "Usuários deletam suas próprias notificações lidas" 
ON public.notificacoes 
FOR DELETE 
USING (
  auth.uid() = user_id AND lida = true
);
