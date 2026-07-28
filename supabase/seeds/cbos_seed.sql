-- Seed: cbos
-- Description: Códigos CBO

INSERT INTO cbos (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
