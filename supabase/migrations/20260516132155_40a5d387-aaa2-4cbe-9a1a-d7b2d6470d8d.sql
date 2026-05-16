-- Ensure promo_brindes has unique name
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'promo_brindes_nome_key') THEN
        ALTER TABLE public.promo_brindes ADD CONSTRAINT promo_brindes_nome_key UNIQUE (nome);
    END IF;
END $$;

-- Ensure times has unique name per company (if company column exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'times_nome_empresa_key') THEN
        -- Check if empresa_id exists before adding constraint
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'times' AND column_name = 'empresa_id') THEN
            ALTER TABLE public.times ADD CONSTRAINT times_nome_empresa_key UNIQUE (nome, empresa_id);
        ELSE
            ALTER TABLE public.times ADD CONSTRAINT times_nome_key UNIQUE (nome);
        END IF;
    END IF;
END $$;
