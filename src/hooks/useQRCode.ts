/**
 * @fileoverview Hook para geração de QR Code
 * @module hooks/useQRCode
 */
import { useCallback } from 'react';

export function useQRCode() {
  const generateQRCode = useCallback((value: string, size: number = 200) => {
    // Usar API externa para gerar QR Code
    const encodedValue = encodeURIComponent(value);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`;
  }, []);

  return { generateQRCode };
}

export default useQRCode;
