import { useState, useEffect } from 'react';

interface WindowSize { width: number; height: number; scrollX: number; scrollY: number; }

export function useWindowSizeExtra() {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0, scrollX: 0, scrollY: 0 });

  useEffect(() => {
    const update = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return size;
}
export default useWindowSizeExtra;
