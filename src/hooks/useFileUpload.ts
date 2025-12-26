import { useState, useCallback } from 'react';
export function useFileUpload(options?: { maxSize?: number; accept?: string[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const upload = useCallback(async (file: File) => { setUploading(true); setProgress(0); await new Promise(r => setTimeout(r, 1000)); setProgress(100); setUploading(false); return { url: '', name: file.name }; }, []);
  const addFiles = useCallback((newFiles: FileList | File[]) => setFiles(f => [...f, ...Array.from(newFiles)]), []);
  const removeFile = useCallback((index: number) => setFiles(f => f.filter((_, i) => i !== index)), []);
  return { files, uploading, progress, upload, addFiles, removeFile };
}
