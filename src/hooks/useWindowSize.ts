// V15-146: src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useWindowScroll() {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScroll({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}

export function useScrollPosition() {
  const { y } = useWindowScroll();
  const { height } = useWindowSize();
  
  return {
    scrollY: y,
    scrollPercent: Math.round((y / (document.body.scrollHeight - height)) * 100) || 0,
    isAtTop: y < 10,
    isAtBottom: y + height >= document.body.scrollHeight - 10,
  };
}
