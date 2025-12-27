import { useState, useRef, useCallback } from 'react';

export function useSignature() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature(null);
  }, []);

  const save = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSignature(dataUrl);
      return dataUrl;
    }
    return null;
  }, []);

  return { canvasRef, signature, clear, save };
}
export default useSignature;
