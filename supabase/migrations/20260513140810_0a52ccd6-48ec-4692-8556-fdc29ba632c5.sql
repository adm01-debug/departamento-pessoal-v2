-- Add version column to cargos table
ALTER TABLE public.cargos ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add trigger for cargos
DROP TRIGGER IF EXISTS tr_increment_version_cargos ON public.cargos;
CREATE TRIGGER tr_increment_version_cargos
BEFORE UPDATE ON public.cargos
FOR EACH ROW
EXECUTE FUNCTION public.increment_version();