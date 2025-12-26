import { useCallback } from 'react';
export function useBarcode() {
  const generate = useCallback((value: string, type: 'CODE128' | 'EAN13' | 'QR' = 'CODE128') => { return { svg: `<svg></svg>`, value, type }; }, []);
  return { generate };
}
