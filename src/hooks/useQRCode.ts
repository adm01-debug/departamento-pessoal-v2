import { useCallback } from 'react';
export function useQRCode() {
  const generate = useCallback((value: string, size: number = 200) => { return { dataUrl: '', value, size }; }, []);
  return { generate };
}
