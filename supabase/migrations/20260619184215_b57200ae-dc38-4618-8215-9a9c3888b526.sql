
DO $$
DECLARE
  v_admin_user UUID := 'd4a9885f-88ef-44cc-a79f-0fde3f4fa066';
  v_admin_empresa UUID := '66104399-aba8-4105-bbd3-9bf67820c1d0';
  v_outra_empresa UUID;
  v_folha_outra UUID;
  v_folha_propria UUID;
  v_count_outra INT;
  v_count_propria INT;
BEGIN
  -- Setup como postgres (bypassa RLS)
  INSERT INTO public.empresas (razao_social, cnpj)
  VALUES ('EMPRESA TESTE RLS - DELETAR', '00.000.000/0001-99')
  RETURNING id INTO v_outra_empresa;

  INSERT INTO public.folhas_pagamento (empresa_id, competencia)
  VALUES (v_outra_empresa, '2026-06') RETURNING id INTO v_folha_outra;
  INSERT INTO public.folhas_pagamento (empresa_id, competencia)
  VALUES (v_admin_empresa, '2099-12-RLSTEST') RETURNING id INTO v_folha_propria;

  -- Simular JWT do admin como role 'authenticated' → RLS é avaliada
  PERFORM set_config('request.jwt.claims',
    jsonb_build_object('sub', v_admin_user::text, 'role', 'authenticated')::text, true);
  PERFORM set_config('role', 'authenticated', true);

  SELECT count(*) INTO v_count_outra
    FROM public.folhas_pagamento WHERE empresa_id = v_outra_empresa;
  SELECT count(*) INTO v_count_propria
    FROM public.folhas_pagamento WHERE empresa_id = v_admin_empresa;

  -- Voltar para postgres
  PERFORM set_config('role', 'postgres', true);
  PERFORM set_config('request.jwt.claims', NULL, true);

  -- Limpeza sempre
  DELETE FROM public.folhas_pagamento WHERE id IN (v_folha_outra, v_folha_propria);
  DELETE FROM public.empresas WHERE id = v_outra_empresa;

  -- Avaliação
  IF v_count_outra > 0 THEN
    RAISE EXCEPTION '🔴 FALHA RLS multi-tenant: admin enxergou % folha(s) de empresa estrangeira!', v_count_outra;
  END IF;
  IF v_count_propria = 0 THEN
    RAISE EXCEPTION '🔴 FALHA: RLS bloqueou folhas da PRÓPRIA empresa do admin (falso negativo)';
  END IF;

  RAISE NOTICE '✅ ISOLAMENTO MULTI-TENANT VALIDADO em folhas_pagamento';
  RAISE NOTICE '   • Empresa estrangeira: 0 folhas visíveis (esperado: 0) ✓';
  RAISE NOTICE '   • Empresa própria: % folha(s) visíveis (esperado: >=1) ✓', v_count_propria;
END $$;
