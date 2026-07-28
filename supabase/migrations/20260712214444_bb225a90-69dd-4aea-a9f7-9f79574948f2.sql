
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname, c.conrelid::regclass::text AS tbl, a.attname AS col
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
    JOIN pg_class t ON t.oid = c.confrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.contype = 'f'
      AND c.connamespace = 'public'::regnamespace
      AND n.nspname = 'auth' AND t.relname = 'users'
      AND c.confdeltype = 'a'
      AND array_length(c.conkey, 1) = 1
      AND NOT a.attnotnull
  LOOP
    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I;
       ALTER TABLE %s ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE SET NULL;',
      r.tbl, r.conname, r.tbl, r.conname, r.col
    );
  END LOOP;
END $$;
