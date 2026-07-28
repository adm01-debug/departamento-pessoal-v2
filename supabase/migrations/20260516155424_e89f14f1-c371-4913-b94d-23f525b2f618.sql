
DO $$
DECLARE
  v_user_id uuid;
  v_empresa_id uuid;
BEGIN
  -- Pega a empresa existente
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;

  -- Remove usuário caso já exista
  DELETE FROM auth.users WHERE email = 'admin@teste.com';

  v_user_id := gen_random_uuid();

  -- Cria o usuário em auth.users
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'admin@teste.com',
    crypt('AdminPassword123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nome":"Administrador"}'::jsonb,
    now(), now(), '', '', '', ''
  );

  -- Identity (necessária para login com senha)
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_user_id,
    format('{"sub":"%s","email":"%s"}', v_user_id, 'admin@teste.com')::jsonb,
    'email', v_user_id::text,
    now(), now(), now()
  );

  -- Concede role de admin
  INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin')
    ON CONFLICT DO NOTHING;

  -- Vincula à empresa se a tabela user_empresas existir
  IF v_empresa_id IS NOT NULL THEN
    BEGIN
      INSERT INTO public.user_empresas (user_id, empresa_id) VALUES (v_user_id, v_empresa_id)
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;
END $$;
