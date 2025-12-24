/**
 * @fileoverview Upload de arquivo
 * @module components/common/FileUpload
 */
import { memo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps { accept?: string; multiple?: boolean; value?: File[]; onChange: (files: File[]) => void; disabled?: boolean; }

export const FileUpload = memo(function FileUpload({ accept, multiple, value = [], onChange, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange(multiple ? [...value, ...files] : files);
  };

  const handleRemove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={disabled}>
        <Upload className="h-4 w-4 mr-2" />Selecionar arquivo
      </Button>
      {value.length > 0 && (
        <div className="space-y-1">
          {value.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
              <File className="h-4 w-4" /><span className="flex-1 truncate">{file.name}</span>
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(idx)}><X className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
