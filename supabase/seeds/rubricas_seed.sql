-- Seed: rubricas
-- Description: Rubricas padrão CLT

INSERT INTO rubricas (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
