-- Seed: tabelas_inss
-- Description: Tabela INSS 2025

INSERT INTO tabelas_inss (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
