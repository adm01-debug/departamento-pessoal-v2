-- Todos colaboradores
SELECT id::text, nome_completo, cpf, email, status::text, created_at::text
FROM colaboradores
ORDER BY created_at;

-- Admissoes schema
SELECT column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='admissoes'
ORDER BY ordinal_position;

-- Desligamentos schema
SELECT column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='desligamentos'
ORDER BY ordinal_position;

-- Ciclos_avaliacao schema
SELECT column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public' AND table_name='ciclos_avaliacao'
ORDER BY ordinal_position;

-- Enums
SELECT t.typname, e.enumlabel, e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.oid
WHERE t.typname IN ('etapa_admissao','tipo_desligamento','status_onboarding_etapa')
ORDER BY t.typname, e.enumsortorder;

-- Tabela unica para ver tudo junto
SELECT 'total_colaboradores' AS info, count(*)::text AS valor FROM colaboradores
UNION ALL
SELECT 'total_admissoes', count(*)::text FROM admissoes
UNION ALL
SELECT 'total_desligamentos', count(*)::text FROM desligamentos
UNION ALL
SELECT 'total_ciclos_avaliacao', count(*)::text FROM ciclos_avaliacao
UNION ALL
SELECT 'total_onboarding_tarefas', count(*)::text FROM onboarding_tarefas
UNION ALL
SELECT 'total_onboarding_colaborador', count(*)::text FROM onboarding_colaborador
UNION ALL
SELECT 'total_onboarding_kits', count(*)::text FROM onboarding_kits
UNION ALL
SELECT 'total_onboarding_templates', count(*)::text FROM onboarding_templates;
