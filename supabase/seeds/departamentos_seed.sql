-- Seed: departamentos
-- Description: Departamentos padrão

INSERT INTO departamentos (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
