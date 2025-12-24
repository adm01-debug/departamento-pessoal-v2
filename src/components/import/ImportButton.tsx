/**
 * @fileoverview Botão de importação
 * @module components/import/ImportButton
 */
import { memo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImportButtonProps { onFileSelect: (file: File) => void; accept?: string; label?: string; }

export const ImportButton = memo(function ImportButton({ onFileSelect, accept = '.csv,.xlsx', label = 'Importar' }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); };
  return (
    <>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Button variant="outline" onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4 mr-2" />{label}</Button>
    </>
  );
});
