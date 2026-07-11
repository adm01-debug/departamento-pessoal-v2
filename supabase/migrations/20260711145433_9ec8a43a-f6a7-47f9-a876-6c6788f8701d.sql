-- Sprint 1 (retry): endurecimento SECURITY DEFINER + fix param shadowing

-- BLOCO A: apenas service_role
DO $$
DECLARE fn text;
  fns text[] := ARRAY[
    'public.anonimizar_dados_pessoais(uuid)',
    'public.processar_ajuste_aprovado(uuid)',
    'public.reset_login_attempts(text, text)',
    'public.record_failed_login(text, text)',
    'public.fn_link_gov_br_account(uuid, text, text)',
    'public.limpar_govbr_states_expirados()',
    'public.cleanup_security_logs()',
    'public.fn_cleanup_old_logs()',
    'public.gerar_alertas_preditivos_ia()',
    'public.get_personnel_cost_projection(uuid, integer)',
    'public.run_rls_tests()'
  ];
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
  END LOOP;
END $$;

-- BLOCO B: authenticated + service_role
DO $$
DECLARE fn text;
  fns text[] := ARRAY[
    'public.has_role(uuid, app_role)',
    'public.is_admin(uuid)',
    'public.get_user_roles(uuid)',
    'public.get_user_default_empresa(uuid)',
    'public.get_user_empresas(uuid)',
    'public.get_user_scope_empresas(uuid)',
    'public.user_belongs_to_empresa(uuid, uuid)',
    'public.get_auth_empresa_id()',
    'public.calcular_dias_ferias(integer)',
    'public.calculate_lockout_duration(integer)',
    'public.fn_calculate_periodo_aquisitivo(uuid)',
    'public.get_colaborador_banco_horas(uuid)'
  ];
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM anon', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
  END LOOP;
END $$;

-- BLOCO C: anon + authenticated (pré-login)
DO $$
DECLARE fn text;
  fns text[] := ARRAY[
    'public.check_login_lock(text, text)',
    'public.check_brute_force(text, text)',
    'public.check_rate_limit(text, text, uuid)',
    'public.is_ip_blocked(text)',
    'public.is_ip_whitelisted(text)',
    'public.is_country_allowed(text)'
  ];
BEGIN
  FOREACH fn IN ARRAY fns LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
  END LOOP;
END $$;

-- BLOCO D: recriar detectar_fraude_ponto sem shadowing
DROP FUNCTION IF EXISTS public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamp with time zone);

CREATE FUNCTION public.detectar_fraude_ponto(
  _batida_id uuid,
  _colaborador_id uuid,
  _lat_nova numeric,
  _lng_nova numeric,
  _time_nova timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    ultima_lat NUMERIC;
    ultima_lng NUMERIC;
    ultima_time TIMESTAMP WITH TIME ZONE;
    distancia_metros NUMERIC;
    segundos_diff NUMERIC;
    velocidade_kmh NUMERIC;
BEGIN
    SELECT bp.latitude, bp.longitude, bp.created_at
      INTO ultima_lat, ultima_lng, ultima_time
    FROM public.batidas_ponto bp
    WHERE bp.colaborador_id = _colaborador_id
      AND bp.created_at > (_time_nova - INTERVAL '12 hours')
      AND bp.id <> _batida_id
    ORDER BY bp.created_at DESC
    LIMIT 1;

    IF FOUND AND ultima_lat IS NOT NULL AND _lat_nova IS NOT NULL THEN
        distancia_metros := sqrt(pow(_lat_nova - ultima_lat, 2) + pow(_lng_nova - ultima_lng, 2)) * 111320;
        segundos_diff := EXTRACT(EPOCH FROM (_time_nova - ultima_time));

        IF segundos_diff > 0 THEN
            velocidade_kmh := (distancia_metros / segundos_diff) * 3.6;

            IF velocidade_kmh > 1000 THEN
                INSERT INTO public.security_alerts (type, severity, details, user_id)
                VALUES (
                    'PONTO_VELOCIDADE_IMPOSSIVEL',
                    'high',
                    jsonb_build_object(
                        'velocidade_kmh', velocidade_kmh,
                        'distancia_m', distancia_metros,
                        'colaborador_id', _colaborador_id
                    ),
                    NULL
                );

                UPDATE public.batidas_ponto
                   SET anomalia_detectada = true
                 WHERE id = _batida_id;
            END IF;
        END IF;
    END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamp with time zone) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamp with time zone) FROM anon;
REVOKE ALL ON FUNCTION public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamp with time zone) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamp with time zone) TO service_role;