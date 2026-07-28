-- Seed: sindicatos
-- Description: Sindicatos principais

INSERT INTO sindicatos (id, created_at) VALUES
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW()),
  (gen_random_uuid(), NOW())
ON CONFLICT DO NOTHING;
