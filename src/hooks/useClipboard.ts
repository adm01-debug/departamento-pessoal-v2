// V15-093: src/hooks/useClipboard.ts
import { useState, useCallback } from 'react';

interface UseClipboardResult {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string | null>;
  isCopied: boolean;
  reset: () => void;
}

export function useClipboard(timeout = 2000): UseClipboardResult {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), timeout);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
        return true;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, [timeout]);

  const paste = useCallback(async (): Promise<string | null> => {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.error('Failed to paste:', err);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return { copiedText, copy, paste, isCopied, reset };
}
