
-- Onda 11: endurecer superfície SECURITY DEFINER e limpar policies redundantes de avatars

-- 1) processar_ajuste_aprovado: apenas service_role deve executar (chamada via edge function)
REVOKE EXECUTE ON FUNCTION public.processar_ajuste_aprovado(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.processar_ajuste_aprovado(uuid) TO service_role;

-- 2) Avatars: remover policy ampla que permitia listing irrestrito.
-- Mantemos a policy escopada (foldername IS NOT NULL) para leitura pública de arquivos individuais.
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
-- Consolidar policies duplicadas
DROP POLICY IF EXISTS "Users manage own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: users manage own folder" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: anon can read individual objects" ON storage.objects;
