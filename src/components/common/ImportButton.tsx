/**
 * @fileoverview Botão de importação
 * @module components/common/ImportButton
 */
import { memo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImportButtonProps { accept?: string; onImport: (file: File) => void; disabled?: boolean; label?: string; }

export const ImportButton = memo(function ImportButton({ accept = '.xlsx,.csv', onImport, disabled, label = 'Importar' }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { onImport(file); e.target.value = ''; }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={disabled}>
        <Upload className="h-4 w-4 mr-2" />{label}
      </Button>
    </>
  );
});
