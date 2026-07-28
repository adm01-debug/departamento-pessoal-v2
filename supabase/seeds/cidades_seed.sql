-- Seed: cidades
-- Description: Cidades do Brasil

INSERT INTO cidades (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
