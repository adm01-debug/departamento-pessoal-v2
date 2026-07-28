-- Seed: feriados
-- Description: Feriados nacionais

INSERT INTO feriados (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
