import { useState, useEffect } from 'react';

type ShowOnBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'all';

export function useShowOn(breakpoint: ShowOnBreakpoint = 'all') {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const checkVisibility = () => {
      const width = window.innerWidth;
      switch (breakpoint) {
        case 'mobile': setShow(width < 768); break;
        case 'tablet': setShow(width >= 768 && width < 1024); break;
        case 'desktop': setShow(width >= 1024); break;
        default: setShow(true);
      }
    };
    checkVisibility();
    window.addEventListener('resize', checkVisibility);
    return () => window.removeEventListener('resize', checkVisibility);
  }, [breakpoint]);

  return show;
}
export default useShowOn;
