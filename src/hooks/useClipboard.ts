import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: 'Copiado!', description: 'Texto copiado para a área de transferência' });
      setTimeout(() => setCopied(false), timeout);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível copiar', variant: 'destructive' });
    }
  }, [timeout]);

  const reset = useCallback(() => setCopied(false), []);

  return { copied, copy, reset };
}

export default useClipboard;
