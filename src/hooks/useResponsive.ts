import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);
      if (w < breakpoints.sm) setBreakpoint('xs');
      else if (w < breakpoints.md) setBreakpoint('sm');
      else if (w < breakpoints.lg) setBreakpoint('md');
      else if (w < breakpoints.xl) setBreakpoint('lg');
      else if (w < breakpoints['2xl']) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    width,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl',
  };
}

export default useResponsive;
