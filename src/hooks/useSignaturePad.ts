import { useRef, useCallback, useState } from 'react';
export function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const clear = useCallback(() => { const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); setIsEmpty(true); } }, []);
  const getSignature = useCallback(() => canvasRef.current?.toDataURL('image/png') ?? null, []);
  return { canvasRef, isEmpty, clear, getSignature };
}
