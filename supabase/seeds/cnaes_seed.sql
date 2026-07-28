-- Seed: cnaes
-- Description: Códigos CNAE

INSERT INTO cnaes (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
