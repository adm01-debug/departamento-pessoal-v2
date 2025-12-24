import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
interface ImportButtonProps { onClick: () => void; label?: string; loading?: boolean; disabled?: boolean; }
export const ImportButton = memo(function ImportButton({ onClick, label = 'Importar', loading, disabled }: ImportButtonProps) {
  return <Button variant="outline" onClick={onClick} disabled={loading || disabled}><Upload className={`h-4 w-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />{loading ? 'Importando...' : label}</Button>;
});
